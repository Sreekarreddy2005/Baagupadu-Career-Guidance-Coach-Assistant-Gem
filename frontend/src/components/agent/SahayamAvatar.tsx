'use client';

import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { AgentState } from '@/types';

// Use a reliable placeholder model from Three.js examples
const MODEL_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/RobotExpressive/RobotExpressive.glb';

interface AvatarModelProps {
  state: AgentState;
  isSm: boolean;
}

function AvatarModel({ state, isSm }: AvatarModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, group);

  // Map our app's agent state to the assumed animation names (matching RobotExpressive for now)
  const stateToAnim = (s: AgentState) => {
    switch (s) {
      case 'thinking':
        return 'Idle';
      case 'listening':
        return 'Yes'; // RobotExpressive has "Yes" for nodding
      case 'typing':
      case 'celebrating':
        return 'Dance';
      case 'emphasizing':
        return 'Yes';
      default:
        return 'Idle';
    }
  };

  useEffect(() => {
    const animName = stateToAnim(state);
    
    // Play the requested animation, with a crossfade from the previous one
    if (actions && actions[animName]) {
      // Fade out all others
      Object.values(actions).forEach((action) => {
        if (action && action.getClip().name !== animName) {
          action.fadeOut(0.5);
        }
      });
      
      const action = actions[animName];
      if (action) {
        action.reset().fadeIn(0.5).play();
      }
    } else if (actions && Object.keys(actions).length > 0) {
      // Fallback if the assumed names don't exist in the placeholder GLB
      // Just play the first available animation
      const fallbackAction = Object.values(actions)[0];
      if (fallbackAction) {
        fallbackAction.play();
      }
    }
  }, [state, actions]);

  // Subtle interactive mouse tracking
  useFrame((state, delta) => {
    if (!group.current) return;
    
    // Calculate target rotation based on mouse position
    // Map mouse range [-1, 1] to a subtle rotation angle
    const targetX = (state.pointer.x * Math.PI) / 6; // Look left/right
    const targetY = (state.pointer.y * Math.PI) / 12; // Look up/down

    // Smoothly interpolate current rotation to target rotation
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetX, 2 * delta);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -targetY, 2 * delta);
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

// Preload the model to prevent UI jank when rendering
useGLTF.preload(MODEL_URL);

interface SahayamAvatarProps {
  agentState?: AgentState;
  isSm?: boolean;
}

export default function SahayamAvatar({ agentState = 'idle', isSm = false }: SahayamAvatarProps) {
  return (
    <Canvas
      camera={{
        position: isSm ? [0, 1.5, 2.5] : [0, 1.0, 3.8], // Tighter frame for sidebar (isSm), pulled back for hero
        fov: isSm ? 45 : 50,
      }}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      shadows
    >
      {/* High-class lighting matching warm cream UI */}
      <ambientLight intensity={0.6} color="#FFF5E1" />
      <directionalLight
        position={[2, 5, 3]}
        intensity={1.2}
        color="#FFF5E1"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* Environment for beautiful premium reflections */}
      <Environment preset="studio" blur={0.5} />

      <Suspense fallback={null}>
        <AvatarModel state={agentState} isSm={isSm} />
      </Suspense>

      {/* Allow slight constrained user rotation */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2 + 0.1}
        target={[0, 1.2, 0]} // Focus on the upper body/head
      />
    </Canvas>
  );
}
