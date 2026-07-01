'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { a, useSpring } from '@react-spring/three';

interface Props {
  mode?: 'hero' | 'sidebar' | 'dashboard';
}

function ProceduralBot({ mode }: { mode: 'hero' | 'sidebar' | 'dashboard' }) {
  const { viewport } = useThree();
  const mainGroupRef = useRef<THREE.Group>(null);

  // Dynamic Proportional Fit
  let scale = 1.0;
  if (mode === 'dashboard') {
    scale = 1.4; // Correctly sized for 400px container
  } else if (mode === 'hero') {
    scale = 1.0;
  } else {
    scale = 0.8;
  }

  // Relaxed Spring for body, head, & upper arms tracking mouse
  const [fastSprings, fastApi] = useSpring(() => ({
    bodyRot: [0, 0, 0] as [number, number, number],
    headRot: [0, 0, 0] as [number, number, number],
    armLRot: [0, 0, 0] as [number, number, number],
    armRRot: [0, 0, 0] as [number, number, number],
    legLRot: [0, 0, 0] as [number, number, number],
    legRRot: [0, 0, 0] as [number, number, number],
    config: { mass: 2, tension: 120, friction: 30 } // Much floatier
  }));

  // Slow Drag Spring for forearms & calves (Fleshy Lag effect)
  const [dragSprings, dragApi] = useSpring(() => ({
    forearmLRot: [0, 0, 0] as [number, number, number],
    forearmRRot: [0, 0, 0] as [number, number, number],
    calfLRot: [0, 0, 0] as [number, number, number],
    calfRRot: [0, 0, 0] as [number, number, number],
    config: { mass: 3, tension: 80, friction: 40 } // Extreme drag
  }));

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const px = state.pointer.x;
    const py = state.pointer.y;

    if (mainGroupRef.current) {
      const baseY = (mode === 'dashboard' ? -0.8 : -0.5) + Math.sin(t * 1.5) * 0.05;
      mainGroupRef.current.position.y = THREE.MathUtils.lerp(mainGroupRef.current.position.y, baseY, 5 * delta);
    }

    fastApi.start({
      bodyRot: [-py * 0.2, px * 0.4, 0],
      headRot: [-py * 0.6, px * 0.8, 0],
      // Upper Arms swing wildly with mouse
      armLRot: [0.15 - py * 0.8 + Math.cos(t * 1.2) * 0.1, 0, 0.4 + px * 0.6 + Math.sin(t * 1.2) * 0.1],
      armRRot: [0.15 - py * 0.8 + Math.cos(t * 1.3) * 0.1, 0, -0.4 + px * 0.6 - Math.sin(t * 1.3) * 0.1],
      // Legs gently sway and follow
      legLRot: [-0.1 - py * 0.3 + Math.sin(t * 1.0) * 0.05, 0, px * 0.3],
      legRRot: [-0.1 - py * 0.3 + Math.sin(t * 1.1) * 0.05, 0, px * 0.3]
    });

    dragApi.start({
      // Forearms counteract the swing with a massive delay
      forearmLRot: [-0.1 + py * 0.6 + Math.sin(t * 1.2 - 0.5) * 0.15, 0, 0.15 - px * 0.4],
      forearmRRot: [-0.1 + py * 0.6 + Math.sin(t * 1.3 - 0.5) * 0.15, 0, -0.15 - px * 0.4],
      // Calves lag
      calfLRot: [0.15 + py * 0.2 + Math.cos(t * 1.0) * 0.1, 0, 0],
      calfRRot: [0.15 + py * 0.2 + Math.cos(t * 1.1) * 0.1, 0, 0]
    });
  });

  const bodyMaterial = (
    <meshPhysicalMaterial 
      color="#A5B4FC" 
      roughness={0.1} 
      metalness={0.15} 
      clearcoat={1.0} 
    />
  );
  
  const jointMaterial = (
    <meshPhysicalMaterial 
      color="#E0E7FF"
      roughness={0.1} 
      metalness={0.25} 
      clearcoat={1.0} 
    />
  );

  return (
    <a.group 
      ref={mainGroupRef as any} 
      scale={[scale, scale, scale]} 
      position={[0, 0, 0]}
      rotation={fastSprings.bodyRot as any}
    >
      {/* ── Torso ── */}
      <mesh position={[0, -0.2, 0]}>
        <capsuleGeometry args={[0.85, 1.0, 64, 64]} />
        {bodyMaterial}
      </mesh>

      {/* ── Head (Child of main group) ── */}
      <a.group position={[0, 1.7, 0]} rotation={fastSprings.headRot as any}>
        <mesh>
          <sphereGeometry args={[0.7, 64, 64]} />
          <meshPhysicalMaterial color="#A5B4FC" roughness={0.1} metalness={0.1} clearcoat={1.0} />
        </mesh>

        <mesh position={[0, 0.05, 0.48]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.3, 0.5, 64, 64]} />
          <meshPhysicalMaterial color="#0F172A" roughness={0.0} metalness={0.8} clearcoat={1.0} />
        </mesh>
        
        <group position={[0, 0.05, 0.81]}>
          <mesh position={[-0.18, 0.1, 0]}>
            <sphereGeometry args={[0.06, 32, 32]} />
            <meshStandardMaterial color="#00CEC9" emissive="#00CEC9" emissiveIntensity={2.5} toneMapped={false} />
          </mesh>
          <mesh position={[0.18, 0.1, 0]}>
            <sphereGeometry args={[0.06, 32, 32]} />
            <meshStandardMaterial color="#00CEC9" emissive="#00CEC9" emissiveIntensity={2.5} toneMapped={false} />
          </mesh>
          <mesh position={[0, -0.1, 0.02]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.03, 0.15, 32, 32]} />
            <meshStandardMaterial color="#00CEC9" emissive="#00CEC9" emissiveIntensity={2.5} toneMapped={false} />
          </mesh>
        </group>
      </a.group>

      {/* ── Left Arm (Hierarchical Rig) ── */}
      <a.group 
        position={[-1.1, 0.6, 0]}
        rotation={fastSprings.armLRot as any}
      >
        <mesh><sphereGeometry args={[0.22, 32, 32]} />{jointMaterial}</mesh>
        <mesh position={[0, -0.35, 0]}><capsuleGeometry args={[0.16, 0.4, 32, 32]} />{bodyMaterial}</mesh>
        
        <a.group 
          position={[0, -0.7, 0]}
          rotation={dragSprings.forearmLRot as any}
        >
          <mesh><sphereGeometry args={[0.16, 32, 32]} />{jointMaterial}</mesh>
          <mesh position={[0, -0.3, 0]}><capsuleGeometry args={[0.14, 0.4, 32, 32]} />{bodyMaterial}</mesh>
          <mesh position={[0, -0.65, 0]}><capsuleGeometry args={[0.14, 0.15, 32, 32]} />{bodyMaterial}</mesh>
        </a.group>
      </a.group>

      {/* ── Right Arm (Hierarchical Rig) ── */}
      <a.group 
        position={[1.1, 0.6, 0]}
        rotation={fastSprings.armRRot as any}
      >
        <mesh><sphereGeometry args={[0.22, 32, 32]} />{jointMaterial}</mesh>
        <mesh position={[0, -0.35, 0]}><capsuleGeometry args={[0.16, 0.4, 32, 32]} />{bodyMaterial}</mesh>
        
        <a.group 
          position={[0, -0.7, 0]}
          rotation={dragSprings.forearmRRot as any}
        >
          <mesh><sphereGeometry args={[0.16, 32, 32]} />{jointMaterial}</mesh>
          <mesh position={[0, -0.3, 0]}><capsuleGeometry args={[0.14, 0.4, 32, 32]} />{bodyMaterial}</mesh>
          <mesh position={[0, -0.65, 0]}><capsuleGeometry args={[0.14, 0.15, 32, 32]} />{bodyMaterial}</mesh>
        </a.group>
      </a.group>

      {/* ── Left Leg (Hierarchical Rig) ── */}
      <a.group 
        position={[-0.4, -1.0, 0]}
        rotation={fastSprings.legLRot as any}
      >
        <mesh><sphereGeometry args={[0.2, 32, 32]} />{jointMaterial}</mesh>
        <mesh position={[0, -0.3, 0]}><capsuleGeometry args={[0.18, 0.3, 32, 32]} />{bodyMaterial}</mesh>
        
        <a.group 
          position={[0, -0.6, 0]}
          rotation={dragSprings.calfLRot as any}
        >
          <mesh><sphereGeometry args={[0.18, 32, 32]} />{jointMaterial}</mesh>
          <mesh position={[0, -0.25, 0]}><capsuleGeometry args={[0.16, 0.3, 32, 32]} />{bodyMaterial}</mesh>
          <mesh position={[0, -0.5, 0.1]} rotation={[Math.PI / 2.5, 0, 0]}><capsuleGeometry args={[0.16, 0.2, 32, 32]} />{bodyMaterial}</mesh>
        </a.group>
      </a.group>

      {/* ── Right Leg (Hierarchical Rig) ── */}
      <a.group 
        position={[0.4, -1.0, 0]}
        rotation={fastSprings.legRRot as any}
      >
        <mesh><sphereGeometry args={[0.2, 32, 32]} />{jointMaterial}</mesh>
        <mesh position={[0, -0.3, 0]}><capsuleGeometry args={[0.18, 0.3, 32, 32]} />{bodyMaterial}</mesh>
        
        <a.group 
          position={[0, -0.6, 0]}
          rotation={dragSprings.calfRRot as any}
        >
          <mesh><sphereGeometry args={[0.18, 32, 32]} />{jointMaterial}</mesh>
          <mesh position={[0, -0.25, 0]}><capsuleGeometry args={[0.16, 0.3, 32, 32]} />{bodyMaterial}</mesh>
          <mesh position={[0, -0.5, 0.1]} rotation={[Math.PI / 2.5, 0, 0]}><capsuleGeometry args={[0.16, 0.2, 32, 32]} />{bodyMaterial}</mesh>
        </a.group>
      </a.group>
    </a.group>
  );
}

export default function SahayamCharacter({ mode = 'sidebar' }: Props) {
  let cameraZ = 5.5;
  if (mode === 'hero') cameraZ = 7.5;
  else if (mode === 'dashboard') cameraZ = 6.5; 
  
  return (
    <Canvas
      className="absolute inset-0"
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      camera={{
        position: mode === 'sidebar' ? [0, 0.2, 5.5] : [0, 0, cameraZ],
        fov: mode === 'sidebar' ? 45 : 50,
      }}
      shadows
    >
      <ambientLight intensity={1.5} color="#FFFFFF" />
      <directionalLight position={[3, 5, 4]} intensity={1.5} color="#FFFFFF" castShadow />
      
      {/* Replaced Environment preset with a fallback rim light to avoid network fetch errors */}
      <directionalLight position={[-3, -5, -4]} intensity={0.5} color="#A5B4FC" />
      
      <ProceduralBot mode={mode} />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        minAzimuthAngle={-Math.PI / 3}
        maxAzimuthAngle={Math.PI / 3}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.8}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}
