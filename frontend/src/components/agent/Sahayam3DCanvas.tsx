'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshWobbleMaterial, Sphere, RoundedBox, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { AgentState } from '@/types';

interface Sahayam3DCanvasProps {
  agentState: AgentState;
  moodColor?: string;
  isSm?: boolean;
}

function SahayamModel({ agentState, moodColor, isSm }: Sahayam3DCanvasProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  
  const targetRotation = useRef(new THREE.Vector3(0, 0, 0));
  const targetScale = useRef(new THREE.Vector3(1, 1, 1));

  useFrame((state, delta) => {
    if (!groupRef.current || !headRef.current) return;

    const t = state.clock.elapsedTime;
    
    // State-based animation logic
    if (agentState === 'listening') {
      targetRotation.current.set(0, Math.sin(t * 2) * 0.1, Math.sin(t * 3) * 0.05);
      targetScale.current.set(1.02, 1.05, 1.02);
      headRef.current.position.y = THREE.MathUtils.lerp(headRef.current.position.y, 1.1 + Math.sin(t * 4) * 0.05, 0.1);
    } else if (agentState === 'thinking') {
      targetRotation.current.set(Math.sin(t * 1.5) * 0.1, Math.cos(t * 1.5) * 0.2, 0);
      targetScale.current.set(1, 1, 1);
      headRef.current.position.y = THREE.MathUtils.lerp(headRef.current.position.y, 1.3, 0.1);
    } else if (agentState === 'typing') {
      targetRotation.current.set(0.1, 0, 0);
      targetScale.current.set(1, 1.02, 1);
      headRef.current.position.y = THREE.MathUtils.lerp(headRef.current.position.y, 1.0 + Math.sin(t * 10) * 0.02, 0.2);
    } else if (agentState === 'celebrating') {
      targetRotation.current.set(0, t * 2, Math.sin(t * 5) * 0.1);
      targetScale.current.set(1.1, 1.1, 1.1);
      headRef.current.position.y = THREE.MathUtils.lerp(headRef.current.position.y, 1.5 + Math.sin(t * 8) * 0.2, 0.1);
    } else {
      // Idle
      targetRotation.current.set(0, Math.sin(t * 0.5) * 0.05, 0);
      targetScale.current.set(1, 1 + Math.sin(t * 2) * 0.02, 1);
      headRef.current.position.y = THREE.MathUtils.lerp(headRef.current.position.y, 1.1, 0.05);
    }

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotation.current.x, delta * 3);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation.current.y, delta * 3);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotation.current.z, delta * 3);
    
    groupRef.current.scale.lerp(targetScale.current, delta * 4);
  });

  const primaryColor = moodColor || '#6366F1';
  const secondaryColor = '#818CF8';

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Body */}
        <RoundedBox args={[1.4, 1.8, 0.8]} radius={0.4} smoothness={4} position={[0, 0, 0]}>
          <MeshWobbleMaterial color={primaryColor} factor={0.1} speed={2} roughness={0.2} metalness={0.1} />
        </RoundedBox>
        
        {/* Glow Core */}
        <Sphere args={[0.4, 32, 32]} position={[0, 0.2, 0.35]}>
          <meshStandardMaterial color="#FFFFFF" emissive={secondaryColor} emissiveIntensity={2} toneMapped={false} />
        </Sphere>

        {/* Head */}
        <Sphere ref={headRef} args={[0.7, 32, 32]} position={[0, 1.2, 0.1]}>
          <meshStandardMaterial color="#FDFBF7" roughness={0.1} metalness={0.2} />
        </Sphere>

        {/* Eyes */}
        <group position={[0, 1.3, 0.75]}>
          <Sphere args={[0.08, 16, 16]} position={[-0.25, 0, 0]}>
            <meshBasicMaterial color="#1E293B" />
          </Sphere>
          <Sphere args={[0.08, 16, 16]} position={[0.25, 0, 0]}>
            <meshBasicMaterial color="#1E293B" />
          </Sphere>
        </group>
        
        {/* Aura / Halo */}
        <mesh position={[0, 0, -0.2]}>
          <planeGeometry args={[4, 4]} />
          <meshBasicMaterial 
            color={primaryColor} 
            transparent 
            opacity={0.15} 
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default function Sahayam3DCanvas(props: Sahayam3DCanvasProps) {
  return (
    <div className={`relative w-full h-full min-h-[300px] ${props.isSm ? 'min-h-[100px]' : ''}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FDFBF7" />
        <pointLight position={[-10, -10, -5]} intensity={1} color={props.moodColor || '#6366F1'} />
        
        <Environment preset="city" />
        
        <SahayamModel {...props} />
        
        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} color="#1E293B" />
      </Canvas>
    </div>
  );
}
