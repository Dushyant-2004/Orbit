'use client';

import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  ContactShadows,
  PresentationControls,
  Float,
  Html,
  useProgress,
} from '@react-three/drei';
import { motion } from 'framer-motion';
import { RotateCcw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import * as THREE from 'three';

// Loading component
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 rounded-full border-4 border-neon-blue/20" />
          <div 
            className="absolute inset-0 rounded-full border-4 border-neon-blue border-t-transparent animate-spin" 
            style={{ 
              clipPath: `polygon(0 0, 100% 0, 100% ${progress}%, 0 ${progress}%)` 
            }}
          />
        </div>
        <p className="mt-4 text-neon-blue text-sm font-medium">{progress.toFixed(0)}%</p>
      </div>
    </Html>
  );
}

// Demo 3D Model - A stylized product box/cube
function ProductModel({ color = '#00d4ff', isRotating = true }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current && isRotating) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial 
          color={color}
          metalness={0.8}
          roughness={0.2}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh scale={2.2}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={hovered ? 0.3 : 0.1}
        />
      </mesh>
    </Float>
  );
}

// Animated ring around the product
function AnimatedRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2;
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh ref={ringRef} position={[0, 0, 0]}>
      <torusGeometry args={[2.5, 0.02, 16, 100]} />
      <meshBasicMaterial color="#00d4ff" transparent opacity={0.5} />
    </mesh>
  );
}

// Particles background
function Particles({ count = 100 }) {
  const mesh = useRef<THREE.Points>(null);
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#00d4ff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

interface Product3DViewerProps {
  modelUrl?: string;
  productName?: string;
  color?: string;
}

export function Product3DViewer({ 
  modelUrl, 
  productName = 'Product', 
  color = '#00d4ff' 
}: Product3DViewerProps) {
  const [isRotating, setIsRotating] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full aspect-square rounded-2xl overflow-hidden glass-card ${
        isFullscreen ? 'fixed inset-0 z-50 aspect-auto' : ''
      }`}
    >
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [5, 5, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={<Loader />}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />

          {/* Environment */}
          <Environment preset="city" />

          {/* Product */}
          <PresentationControls
            global
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
            config={{ mass: 2, tension: 400 }}
            snap={{ mass: 4, tension: 400 }}
          >
            <ProductModel color={color} isRotating={isRotating} />
          </PresentationControls>

          {/* Decorative elements */}
          <AnimatedRing />
          <Particles count={50} />

          {/* Shadows */}
          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.5}
            scale={10}
            blur={2}
            far={4}
          />

          {/* Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={4}
            maxDistance={10}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>

      {/* Controls Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-2 rounded-lg transition-colors ${
              isRotating ? 'bg-neon-blue text-white' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Maximize2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Product Name */}
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 text-xs font-medium bg-neon-blue/20 text-neon-blue rounded-full">
          3D Preview
        </span>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 text-xs text-gray-400">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}

// Hero 3D Scene for homepage
export function Hero3DScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#00d4ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
        
        <Particles count={200} />
        
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
          <mesh position={[3, 1, -2]} scale={0.5}>
            <octahedronGeometry />
            <meshStandardMaterial color="#00d4ff" wireframe opacity={0.5} transparent />
          </mesh>
        </Float>
        
        <Float speed={2} rotationIntensity={0.4} floatIntensity={0.4}>
          <mesh position={[-3, -1, -1]} scale={0.7}>
            <icosahedronGeometry />
            <meshStandardMaterial color="#a855f7" wireframe opacity={0.5} transparent />
          </mesh>
        </Float>
        
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
          <mesh position={[0, 2, -3]} scale={0.4}>
            <torusKnotGeometry args={[1, 0.3, 100, 16]} />
            <meshStandardMaterial color="#ec4899" wireframe opacity={0.3} transparent />
          </mesh>
        </Float>
      </Canvas>
    </div>
  );
}
