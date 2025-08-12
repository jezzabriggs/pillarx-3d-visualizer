'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { geometryDB, CADGeometry } from '@/lib/firebase'

interface FileImporterProps {
  onImportComplete: (geometry: CADGeometry) => void
}

export default function FileImporter({ onImportComplete }: FileImporterProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    // Check file type
    const allowedTypes = ['.stp', '.obj', '.fbx', '.stl']
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    
    if (!allowedTypes.includes(fileExtension)) {
      alert('Please select a valid 3D model file (.stp, .obj, .fbx, .stl)')
      return
    }

    try {
      setUploading(true)
      setUploadProgress(0)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      // In a real app, you would upload to Firebase Storage here
      // For now, we'll create a mock file URL
      const mockFileUrl = `https://example.com/uploads/${file.name}`
      
      // Create geometry record in Firestore
      const geometryData = {
        name: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
        description: `Imported 3D model: ${file.name}`,
        category: 'imported' as const,
        geometryType: 'custom' as const,
        parameters: {
          fileName: file.name,
          fileSize: file.size,
          fileType: fileExtension
        },
        material: {
          color: '#DC2626',
          metalness: 0.1,
          roughness: 0.2
        },
        tags: ['imported', '3d-model'],
        isPublic: true,
        downloadCount: 0,
        rating: 0,
        fileUrl: mockFileUrl
      }

      const geometryId = await geometryDB.createGeometry(geometryData)
      
      // Complete upload
      setUploadProgress(100)
      clearInterval(progressInterval)
      
      // Get the created geometry and pass it to parent
      const createdGeometry = await geometryDB.getGeometry(geometryId)
      if (createdGeometry) {
        onImportComplete(createdGeometry)
      }

      // Reset form
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file. Please try again.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4">Import 3D Model</h3>
      
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".stp,.obj,.fbx,.stl"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Drag & Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-red-500 bg-red-900/10'
            : 'border-gray-600 hover:border-red-600'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="text-white">Uploading...</p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-gray-400 text-sm">{uploadProgress}%</p>
          </div>
        ) : (
          <>
            <div className="text-4xl mb-4">📁</div>
            <p className="text-white text-lg mb-2">Drop your 3D model here</p>
            <p className="text-gray-400 mb-4">
              Supports: STP, OBJ, FBX, STL
            </p>
            <button
              onClick={openFileDialog}
              className="btn-primary"
            >
              Choose File
            </button>
          </>
        )}
      </div>

      {/* Upload Tips */}
      <div className="mt-4 p-4 bg-gray-800 rounded-lg">
        <h4 className="text-white font-medium mb-2">Upload Tips:</h4>
        <ul className="text-gray-400 text-sm space-y-1">
          <li>• Maximum file size: 50MB</li>
          <li>• Supported formats: STP, OBJ, FBX, STL</li>
          <li>• For best results, use STP or STL formats</li>
          <li>• Ensure your model has proper materials and textures</li>
        </ul>
      </div>
    </div>
  )
} 