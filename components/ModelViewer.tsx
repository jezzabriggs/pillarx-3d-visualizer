'use client'

import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Grid, Environment, Stats, Html } from '@react-three/drei'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

interface ModelViewerProps {
  model: string
  settings: {
    backgroundColor: string
    showGrid: boolean
    showAxes: boolean
    autoRotate: boolean
  }
  customGeometry?: any // Add support for custom geometries
}

// Scene component that handles the 3D scene setup
function Scene({ model, settings, customGeometry }: ModelViewerProps) {
  const { scene } = useThree()
  
  useEffect(() => {
    // Set background color
    scene.background = new THREE.Color(settings.backgroundColor)
  }, [scene, settings.backgroundColor])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      {/* Environment for realistic lighting */}
      <Environment preset="city" />
      
      {/* Grid */}
      {settings.showGrid && (
        <Grid 
          args={[20, 20]} 
          cellSize={1} 
          cellThickness={0.5} 
          cellColor="#9ca3af" 
          sectionSize={5} 
          sectionThickness={1} 
          sectionColor="#6b7280" 
          fadeDistance={25} 
          fadeStrength={1} 
          followCamera={false} 
          infiniteGrid={true} 
        />
      )}
      
      {/* Axes */}
      {settings.showAxes && (
        <axesHelper args={[5]} />
      )}
      
      {/* 3D Models */}
      <ModelSelector model={model} autoRotate={settings.autoRotate} customGeometry={customGeometry} />
      
      {/* Orbit Controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={settings.autoRotate}
        autoRotateSpeed={1}
        minDistance={2}
        maxDistance={20}
        target={[0, 0, 0]}
      />
      
      {/* Performance Stats - Removed FPS counter */}
    </>
  )
}



// Component that renders different 3D models based on selection
function ModelSelector({ model, autoRotate, customGeometry }: { model: string; autoRotate: boolean; customGeometry?: any }) {
  const [loadedModel, setLoadedModel] = useState<THREE.Group | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useFrame((state) => {
    if (loadedModel && autoRotate) {
      loadedModel.rotation.y += 0.01
    }
  })

  // Load custom geometry file
  useEffect(() => {
    if (customGeometry && model === 'custom' && customGeometry.fileUrl) {
      console.log('🔄 Loading custom geometry:', customGeometry.name)
      console.log('📁 File URL:', customGeometry.fileUrl)
      console.log('📋 File type:', customGeometry.parameters?.fileType)
      
      setLoading(true)
      setError(null)
      
      // Load the 3D file based on its type
      const loadFile = async () => {
        try {
          if (customGeometry.parameters?.fileType === '.obj') {
            console.log('📥 Loading OBJ file...')
            const loader = new OBJLoader()
            const object = await loader.loadAsync(customGeometry.fileUrl)
            
            // Center and scale the model
            const box = new THREE.Box3().setFromObject(object)
            const center = box.getCenter(new THREE.Vector3())
            const size = box.getSize(new THREE.Vector3())
            const maxDim = Math.max(size.x, size.y, size.z)
            
            // More aggressive scaling to make model visible
            const scale = 8 / maxDim // Increased from 4 to 8 for better visibility
            
            // Reset object transformations
            object.position.set(0, 0, 0)
            object.rotation.set(0, 0, 0)
            object.scale.setScalar(scale)
            
            // Center the model by moving it to origin
            object.position.sub(center.multiplyScalar(scale))
            
            // Add some debugging
            console.log('📏 Model dimensions:', size)
            console.log('🎯 Model center:', center)
            console.log('📐 Applied scale:', scale)
            console.log('📍 Final position:', object.position)
            
            // Fallback: if model is still too small, force a minimum scale
            if (scale < 0.1) {
              console.log('⚠️ Model too small, applying fallback scale')
              object.scale.setScalar(1)
              object.position.set(0, 0, 0)
            }
            
            setLoadedModel(object)
            console.log('✅ OBJ file loaded successfully')
            
          } else if (customGeometry.parameters?.fileType === '.gltf' || customGeometry.parameters?.fileType === '.glb') {
            console.log('📥 Loading GLTF/GLB file...')
            const loader = new GLTFLoader()
            const gltf = await loader.loadAsync(customGeometry.fileUrl)
            
            const object = gltf.scene
            
            // Center and scale the model
            const box = new THREE.Box3().setFromObject(object)
            const center = box.getCenter(new THREE.Vector3())
            const size = box.getSize(new THREE.Vector3())
            const maxDim = Math.max(size.x, size.y, size.z)
            
            // More aggressive scaling to make model visible
            const scale = 8 / maxDim // Increased from 4 to 8 for better visibility
            
            // Reset object transformations
            object.position.set(0, 0, 0)
            object.rotation.set(0, 0, 0)
            object.scale.setScalar(scale)
            
            // Center the model by moving it to origin
            object.position.sub(center.multiplyScalar(scale))
            
            // Add some debugging
            console.log('📏 Model dimensions:', size)
            console.log('🎯 Model center:', center)
            console.log('📐 Applied scale:', scale)
            console.log('📍 Final position:', object.position)
            
            // Fallback: if model is still too small, force a minimum scale
            if (scale < 0.1) {
              console.log('⚠️ Model too small, applying fallback scale')
              object.scale.setScalar(1)
              object.position.set(0, 0, 0)
            }
            
            setLoadedModel(object)
            console.log('✅ GLTF/GLB file loaded successfully')
            
          } else {
            setError(`File type ${customGeometry.parameters?.fileType} is not yet supported. Currently showing placeholder.`)
          }
        } catch (err) {
          console.error('Error loading 3D file:', err)
          setError('Failed to load 3D file. Showing placeholder.')
        } finally {
          setLoading(false)
        }
      }
      
      loadFile()
    }
  }, [customGeometry, model])

  const renderModel = () => {
    // If we have a custom geometry, render it
    if (customGeometry && model === 'custom') {
      if (loading) {
        return (
          <group>
            {/* Loading message only - no placeholder geometry */}
            <Html position={[0, 0, 0]} center>
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded text-sm max-w-xs text-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto mb-2"></div>
                Loading {customGeometry.name}...
              </div>
            </Html>
          </group>
        )
      }
      
      if (error) {
        return (
          <group>
            {/* Error message only - no placeholder geometry */}
            <Html position={[0, 0, 0]} center>
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm max-w-xs text-center">
                <strong>❌ Error Loading {customGeometry.name}</strong><br/>
                <span className="text-xs text-red-600">{error}</span>
              </div>
            </Html>
          </group>
        )
      }
      
      if (loadedModel) {
        return <primitive object={loadedModel} />
      }
      
      // No model loaded and no error - show error message
      return (
        <group>
          <Html position={[0, 0, 0]} center>
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded text-sm max-w-xs text-center">
              <strong>⚠️ No 3D Model Available</strong><br/>
              <span className="text-xs text-yellow-600">Unable to load {customGeometry.name}</span>
            </div>
          </Html>
        </group>
      )
    }
    
    // Default fallback - show message when no custom geometry is selected
    return (
      <group>
        <Html position={[0, 0, 0]} center>
          <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-2 rounded text-sm max-w-xs text-center">
            <strong>📋 Select a Model</strong><br/>
            <span className="text-xs text-gray-600">Choose a model type from the dropdown above</span>
          </div>
        </Html>
      </group>
    )
  }

  return renderModel()
}

// Loading component
function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading 3D Scene...</p>
      </div>
    </div>
  )
}

// Main ModelViewer component
export default function ModelViewer({ model, settings, customGeometry }: ModelViewerProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        camera={{ position: [5, 5, 5], fov: 75 }}
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <Suspense fallback={null}>
          <Scene model={model} settings={settings} customGeometry={customGeometry} />
        </Suspense>
      </Canvas>
      
      {/* Loading overlay */}
      <Suspense fallback={<Loader />}>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-red-200 shadow-sm">
          <p className="text-sm text-gray-700">
            Model: <span className="text-red-600 font-medium">{model}</span>
          </p>
        </div>
      </Suspense>
    </div>
  )
} 