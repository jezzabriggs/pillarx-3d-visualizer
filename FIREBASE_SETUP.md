# 🔥 Firebase Setup Guide for CAD Geometry Database

This guide will help you set up Firebase Firestore to store and manage your CAD geometries.

## 📋 Prerequisites

- A Google account
- Node.js and npm installed
- Basic knowledge of Firebase

## 🚀 Step 1: Create Firebase Project

1. **Go to Firebase Console**
   - Visit [console.firebase.google.com](https://console.firebase.google.com)
   - Sign in with your Google account

2. **Create New Project**
   - Click "Create a project"
   - Enter project name: `pillarx-3d-visualizer` (or your preferred name)
   - Enable Google Analytics (optional)
   - Click "Create project"

3. **Wait for Project Creation**
   - Firebase will set up your project
   - Click "Continue" when ready

## 🔧 Step 2: Enable Firestore Database

1. **Navigate to Firestore**
   - In the left sidebar, click "Firestore Database"
   - Click "Create database"

2. **Choose Security Rules**
   - Select "Start in test mode" (for development)
   - Click "Next"

3. **Choose Location**
   - Select a location close to your users
   - Click "Enable"

## 🔑 Step 3: Get Firebase Configuration

1. **Project Settings**
   - Click the gear icon ⚙️ next to "Project Overview"
   - Select "Project settings"

2. **Add Web App**
   - Scroll down to "Your apps"
   - Click the web icon (</>)
   - Enter app nickname: `pillarx-web`
   - Click "Register app"

3. **Copy Configuration**
   - Copy the Firebase config object
   - It looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };
   ```

## 📝 Step 4: Configure Environment Variables

1. **Create .env.local file**
   - In your project root, create `.env.local`
   - Add your Firebase config:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

2. **Replace Values**
   - Replace all `your_*_here` values with your actual Firebase config
   - Save the file

## 🗄️ Step 5: Set Up Firestore Collections

1. **Go to Firestore Database**
   - In Firebase console, click "Firestore Database"

2. **Create Collections**
   - Click "Start collection"
   - Collection ID: `geometries`
   - Document ID: `auto-id`
   - Add a sample document:

```json
{
  "name": "Sample Cube",
  "description": "A simple cube geometry",
  "category": "primitive",
  "geometryType": "cube",
  "parameters": {
    "width": 2,
    "height": 2,
    "depth": 2
  },
  "material": {
    "color": "#DC2626",
    "metalness": 0.1,
    "roughness": 0.2
  },
  "tags": ["cube", "primitive", "sample"],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "isPublic": true,
  "downloadCount": 0,
  "rating": 0
}
```

3. **Create Additional Collections** (optional):
   - `users` - for user management
   - `categories` - for geometry categories
   - `tags` - for geometry tags

## 🔒 Step 5: Configure Security Rules

1. **Go to Firestore Rules**
   - In Firestore Database, click "Rules" tab

2. **Update Rules**
   - Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to public geometries
    match /geometries/{geometryId} {
      allow read: if resource.data.isPublic == true;
      allow write: if request.auth != null;
    }
    
    // Allow authenticated users to manage their geometries
    match /geometries/{geometryId} {
      allow create, update, delete: if request.auth != null;
    }
    
    // Allow read access to categories and tags
    match /categories/{categoryId} {
      allow read: if true;
    }
    
    match /tags/{tagId} {
      allow read: if true;
    }
  }
}
```

3. **Publish Rules**
   - Click "Publish"

## 🧪 Step 6: Test Your Setup

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Navigate to Geometry Library**
   - Click the "Geometry Library" tab
   - Try creating a new geometry

3. **Check Firestore**
   - Go to Firebase console
   - Check if your geometry appears in the `geometries` collection

## 🚀 Step 7: Deploy to Production

1. **Update Security Rules**
   - Modify rules for production use
   - Consider adding user authentication

2. **Environment Variables**
   - Set production environment variables in Vercel
   - Never commit `.env.local` to version control

## 🔍 Troubleshooting

### Common Issues:

1. **"Firebase App not initialized"**
   - Check your environment variables
   - Ensure `.env.local` is in project root

2. **"Permission denied"**
   - Check Firestore security rules
   - Ensure you're using test mode or proper authentication

3. **"Collection not found"**
   - Create the required collections in Firestore
   - Check collection names match your code

### Debug Tips:

1. **Check Console Logs**
   - Open browser developer tools
   - Look for Firebase-related errors

2. **Verify Environment Variables**
   - Check if variables are loaded correctly
   - Restart development server after changes

3. **Firebase Console**
   - Monitor Firestore usage
   - Check for failed requests

## 📚 Next Steps

1. **Add Authentication**
   - Implement user login/signup
   - Secure user-specific geometries

2. **File Storage**
   - Set up Firebase Storage for 3D model files (STP, OBJ, FBX, STL)
   - Implement file upload/download

3. **Advanced Queries**
   - Add search functionality
   - Implement pagination
   - Add sorting and filtering

4. **Real-time Updates**
   - Use Firestore listeners for live updates
   - Implement collaborative features

## 🆘 Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

Your CAD geometry database is now ready! 🎉 