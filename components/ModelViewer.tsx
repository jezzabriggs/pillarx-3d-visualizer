'use client'

import { Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Grid, Environment, Stats } from '@react-three/drei'
import * as THREE from 'three'

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
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += 0.01
    }
  })

  const renderModel = () => {
    // If we have a custom geometry, render it
    if (customGeometry && model === 'custom') {
      return (
        <mesh ref={meshRef} castShadow receiveShadow>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial 
            color={customGeometry.material?.color || "#DC2626"} 
            metalness={customGeometry.material?.metalness || 0.1} 
            roughness={customGeometry.material?.roughness || 0.2} 
          />
        </mesh>
      )
    }
    
    // Default fallback - show a placeholder when no custom geometry is selected
    return (
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#6b7280" metalness={0.1} roughness={0.8} />
      </mesh>
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