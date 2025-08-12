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
}

// Scene component that handles the 3D scene setup
function Scene({ model, settings }: ModelViewerProps) {
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
          cellColor="#374151" 
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
      <ModelSelector model={model} autoRotate={settings.autoRotate} />
      
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
      
      {/* Performance Stats */}
      <Stats />
    </>
  )
}

// Component that renders different 3D models based on selection
function ModelSelector({ model, autoRotate }: { model: string; autoRotate: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += 0.01
    }
  })

  const renderModel = () => {
    switch (model) {
      case 'cube':
        return (
          <mesh ref={meshRef} castShadow receiveShadow>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#DC2626" metalness={0.1} roughness={0.2} />
          </mesh>
        )
      
      case 'sphere':
        return (
          <mesh ref={meshRef} castShadow receiveShadow>
            <sphereGeometry args={[1.5, 32, 32]} />
            <meshStandardMaterial color="#B91C1C" metalness={0.1} roughness={0.1} />
          </mesh>
        )
      
      case 'torus':
        return (
          <mesh ref={meshRef} castShadow receiveShadow>
            <torusGeometry args={[1.5, 0.5, 16, 32]} />
            <meshStandardMaterial color="#DC2626" metalness={0.2} roughness={0.3} />
          </mesh>
        )
      
      case 'icosahedron':
        return (
          <mesh ref={meshRef} castShadow receiveShadow>
            <icosahedronGeometry args={[1.5, 1]} />
            <meshStandardMaterial color="#991B1B" metalness={0.3} roughness={0.4} />
          </mesh>
        )
      
      default:
        return (
          <mesh ref={meshRef} castShadow receiveShadow>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#DC2626" metalness={0.1} roughness={0.2} />
          </mesh>
        )
    }
  }

  return renderModel()
}

// Loading component
function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-300">Loading 3D Scene...</p>
      </div>
    </div>
  )
}

// Main ModelViewer component
export default function ModelViewer({ model, settings }: ModelViewerProps) {
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
          <Scene model={model} settings={settings} />
        </Suspense>
      </Canvas>
      
      {/* Loading overlay */}
      <Suspense fallback={<Loader />}>
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-red-900">
          <p className="text-sm text-gray-300">
            Model: <span className="text-red-400 font-medium">{model}</span>
          </p>
        </div>
      </Suspense>
    </div>
  )
} 