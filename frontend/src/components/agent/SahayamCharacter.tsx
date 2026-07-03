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
  const eyesGroupRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);

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
    config: { mass: 2, tension: 120, friction: 30 }
  }));

  // Slow Drag Spring for forearms & calves (Fleshy Lag effect)
  const [dragSprings, dragApi] = useSpring(() => ({
    forearmLRot: [0, 0, 0] as [number, number, number],
    forearmRRot: [0, 0, 0] as [number, number, number],
    calfLRot: [0, 0, 0] as [number, number, number],
    calfRRot: [0, 0, 0] as [number, number, number],
    config: { mass: 3, tension: 80, friction: 40 }
  }));

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const px = state.pointer.x;
    const py = state.pointer.y;

    if (mainGroupRef.current) {
      // Breathing vertical oscillation
      const baseY = (mode === 'dashboard' ? -0.8 : -0.5) + Math.sin(t * 1.5) * 0.05;
      mainGroupRef.current.position.y = THREE.MathUtils.lerp(mainGroupRef.current.position.y, baseY, 5 * delta);
    }
    
    if (eyesGroupRef.current) {
      // Blinking animation
      const blinkCycle = t % 4; // blink every 4 seconds
      const isBlinking = blinkCycle > 3.8;
      const blinkScale = isBlinking ? 0.1 : 1.0;
      eyesGroupRef.current.scale.y = THREE.MathUtils.lerp(eyesGroupRef.current.scale.y, blinkScale, 15 * delta);
      
      // Eye tracking (pupils follow mouse slightly more than head)
      eyesGroupRef.current.position.x = px * 0.05;
      eyesGroupRef.current.position.y = 0.05 - py * 0.05;
    }

    if (mouthRef.current) {
      // Subtle smile (width increases slightly over time)
      const smileWidth = 1 + Math.max(0, Math.sin(t * 0.5)) * 0.3;
      mouthRef.current.scale.x = THREE.MathUtils.lerp(mouthRef.current.scale.x, smileWidth, 2 * delta);
    }

    fastApi.start({
      // Body follows mouse slightly
      bodyRot: [-py * 0.15 + Math.sin(t * 0.8) * 0.02, px * 0.2, 0],
      // Head tilts naturally with mouse and time
      headRot: [-py * 0.4 + Math.sin(t * 0.9) * 0.03, px * 0.6, Math.sin(t * 1.1) * 0.02],
      // Upper Arms naturally rest 20-30 deg outward (Z) and forward (X)
      armLRot: [-0.1 - py * 0.4 + Math.cos(t * 1.2) * 0.05, 0, 0.4 + px * 0.3 + Math.sin(t * 1.2) * 0.05],
      armRRot: [-0.1 - py * 0.4 + Math.cos(t * 1.3) * 0.05, 0, -0.4 + px * 0.3 - Math.sin(t * 1.3) * 0.05],
      // Legs gently sway and follow
      legLRot: [-0.1 - py * 0.2 + Math.sin(t * 1.0) * 0.02, 0, px * 0.2],
      legRRot: [-0.1 - py * 0.2 + Math.sin(t * 1.1) * 0.02, 0, px * 0.2]
    });

    dragApi.start({
      // Forearms have stronger natural elbow bend (-0.4 X rot)
      forearmLRot: [-0.4 + py * 0.4 + Math.sin(t * 1.2 - 0.5) * 0.1, 0, 0.05 - px * 0.2],
      forearmRRot: [-0.4 + py * 0.4 + Math.sin(t * 1.3 - 0.5) * 0.1, 0, -0.05 - px * 0.2],
      // Calves lag
      calfLRot: [0.1 + py * 0.1 + Math.cos(t * 1.0) * 0.05, 0, 0],
      calfRRot: [0.1 + py * 0.1 + Math.cos(t * 1.1) * 0.05, 0, 0]
    });
  });

  const bodyMaterial = (
    <meshPhysicalMaterial 
      color="#A5B4FC" 
      roughness={0.15} 
      metalness={0.1} 
      clearcoat={0.8} 
    />
  );
  
  const jointMaterial = (
    <meshPhysicalMaterial 
      color="#E0E7FF"
      roughness={0.15} 
      metalness={0.2} 
      clearcoat={0.8} 
    />
  );

  return (
    <a.group 
      ref={mainGroupRef as any} 
      scale={[scale, scale, scale]} 
      position={[0, 0, 0]}
      rotation={fastSprings.bodyRot as any}
    >
      {/* ── Torso (Slightly narrower for wider shoulder illusion) ── */}
      <mesh position={[0, -0.2, 0]}>
        <capsuleGeometry args={[0.8, 1.05, 64, 64]} />
        {bodyMaterial}
      </mesh>

      {/* ── Head (Child of main group) ── */}
      <a.group position={[0, 1.7, 0]} rotation={fastSprings.headRot as any}>
        <mesh>
          <sphereGeometry args={[0.7, 64, 64]} />
          <meshPhysicalMaterial color="#A5B4FC" roughness={0.15} metalness={0.1} clearcoat={0.8} />
        </mesh>

        {/* Visor */}
        <mesh position={[0, 0.05, 0.48]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.3, 0.5, 64, 64]} />
          <meshPhysicalMaterial color="#0F172A" roughness={0.05} metalness={0.9} clearcoat={1.0} />
        </mesh>
        
        {/* Eyes & Blinking Group */}
        <group ref={eyesGroupRef as any} position={[0, 0.05, 0.81]}>
          <mesh position={[-0.18, 0.1, 0]}>
            <sphereGeometry args={[0.06, 32, 32]} />
            <meshStandardMaterial color="#00CEC9" emissive="#00CEC9" emissiveIntensity={2.5} toneMapped={false} />
          </mesh>
          <mesh position={[0.18, 0.1, 0]}>
            <sphereGeometry args={[0.06, 32, 32]} />
            <meshStandardMaterial color="#00CEC9" emissive="#00CEC9" emissiveIntensity={2.5} toneMapped={false} />
          </mesh>
          <mesh ref={mouthRef as any} position={[0, -0.1, 0.02]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.03, 0.15, 32, 32]} />
            <meshStandardMaterial color="#00CEC9" emissive="#00CEC9" emissiveIntensity={2.5} toneMapped={false} />
          </mesh>
        </group>
      </a.group>

      {/* ── Left Arm (Moved 15 deg forward on Z, raised Y, widened X) ── */}
      <a.group 
        position={[-1.2, 0.75, 0.25]}
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
          {/* Hands increased by ~10% for presence */}
          <mesh position={[0, -0.65, 0]}><capsuleGeometry args={[0.17, 0.19, 32, 32]} />{bodyMaterial}</mesh>
        </a.group>
      </a.group>

      {/* ── Right Arm ── */}
      <a.group 
        position={[1.2, 0.75, 0.25]}
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
          {/* Hands increased by ~10% again */}
          <mesh position={[0, -0.65, 0]}><capsuleGeometry args={[0.17, 0.19, 32, 32]} />{bodyMaterial}</mesh>
        </a.group>
      </a.group>

      {/* ── Left Leg ── */}
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

      {/* ── Right Leg ── */}
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
