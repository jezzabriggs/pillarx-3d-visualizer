import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Your Firebase configuration
// Replace these with your actual Firebase project config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// CAD Geometry Types
export interface CADGeometry {
  id?: string;
  name: string;
  description: string;
  category: 'primitive' | 'custom' | 'imported' | 'parametric';
  geometryType: 'cube' | 'sphere' | 'torus' | 'cylinder' | 'cone' | 'custom';
  parameters: {
    [key: string]: number | string | boolean;
  };
  material: {
    color: string;
    metalness: number;
    roughness: number;
    opacity?: number;
  };
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  isPublic: boolean;
  downloadCount: number;
  rating: number;
  fileUrl?: string; // For imported models
  thumbnailUrl?: string;
}

// Firestore Collections
export const COLLECTIONS = {
  GEOMETRIES: 'geometries',
  USERS: 'users',
  CATEGORIES: 'categories',
  TAGS: 'tags'
} as const;

// Database operations
export class GeometryDatabase {
  private db = db;

  // Create a new geometry
  async createGeometry(geometry: Omit<CADGeometry, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(this.db, COLLECTIONS.GEOMETRIES), {
      ...geometry,
      createdAt: new Date(),
      updatedAt: new Date(),
      downloadCount: 0,
      rating: 0
    });
    return docRef.id;
  }

  // Get a geometry by ID
  async getGeometry(id: string): Promise<CADGeometry | null> {
    const docRef = doc(this.db, COLLECTIONS.GEOMETRIES, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as CADGeometry;
    }
    return null;
  }

  // Get all geometries with optional filtering
  async getGeometries(options: {
    category?: string;
    tags?: string[];
    limit?: number;
    orderBy?: 'createdAt' | 'downloadCount' | 'rating';
    orderDirection?: 'asc' | 'desc';
  } = {}): Promise<CADGeometry[]> {
    let q: any = collection(this.db, COLLECTIONS.GEOMETRIES);
    
    // Apply filters
    if (options.category) {
      q = query(q, where('category', '==', options.category));
    }
    
    if (options.tags && options.tags.length > 0) {
      q = query(q, where('tags', 'array-contains-any', options.tags));
    }
    
    // Apply ordering
    if (options.orderBy) {
      const direction = options.orderDirection === 'asc' ? 'asc' : 'desc';
      q = query(q, orderBy(options.orderBy, direction));
    }
    
    // Apply limit
    if (options.limit) {
      q = query(q, limit(options.limit));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as any)
    })) as CADGeometry[];
  }

  // Update a geometry
  async updateGeometry(id: string, updates: Partial<CADGeometry>): Promise<void> {
    const docRef = doc(this.db, COLLECTIONS.GEOMETRIES, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date()
    });
  }

  // Delete a geometry
  async deleteGeometry(id: string): Promise<void> {
    const docRef = doc(this.db, COLLECTIONS.GEOMETRIES, id);
    await deleteDoc(docRef);
  }

  // Search geometries by name or description
  async searchGeometries(searchTerm: string): Promise<CADGeometry[]> {
    // Note: Firestore doesn't support full-text search natively
    // This is a simple implementation - consider using Algolia for production
    const allGeometries = await this.getGeometries();
    const term = searchTerm.toLowerCase();
    
    return allGeometries.filter(geometry => 
      geometry.name.toLowerCase().includes(term) ||
      geometry.description.toLowerCase().includes(term) ||
      geometry.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }

  // Get popular geometries
  async getPopularGeometries(limit: number = 10): Promise<CADGeometry[]> {
    return this.getGeometries({
      orderBy: 'downloadCount',
      orderDirection: 'desc',
      limit
    });
  }

  // Get recent geometries
  async getRecentGeometries(limit: number = 10): Promise<CADGeometry[]> {
    return this.getGeometries({
      orderBy: 'createdAt',
      orderDirection: 'desc',
      limit
    });
  }

  // Increment download count
  async incrementDownloadCount(id: string): Promise<void> {
    const geometry = await this.getGeometry(id);
    if (geometry) {
      await this.updateGeometry(id, {
        downloadCount: (geometry.downloadCount || 0) + 1
      });
    }
  }

  // Update rating
  async updateRating(id: string, newRating: number): Promise<void> {
    const geometry = await this.getGeometry(id);
    if (geometry) {
      const currentRating = geometry.rating || 0;
      const currentCount = geometry.downloadCount || 0;
      const averageRating = ((currentRating * currentCount) + newRating) / (currentCount + 1);
      
      await this.updateGeometry(id, {
        rating: averageRating
      });
    }
  }

  // File Storage Methods
  async uploadFile(file: File, geometryId: string): Promise<string> {
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    const storageRef = ref(storage, `geometries/${geometryId}/${file.name}`);
    
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }

  async getFileDownloadURL(filePath: string): Promise<string> {
    try {
      const fileRef = ref(storage, filePath);
      return await getDownloadURL(fileRef);
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw new Error('Failed to get file URL');
    }
  }
}

// Export the database instance
export const geometryDB = new GeometryDatabase();
export { db }; 