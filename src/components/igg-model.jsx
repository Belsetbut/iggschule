"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

const SketchupModel = () => {
  const { scene } = useGLTF("/models/IGG.glb");
  const modelRef = useRef();

  // Define the center position of the model
  const centerPosition = [-420, -100, 100];

  scene.traverse((child) => {
    if (child.isMesh) {
      child.material.side = THREE.DoubleSide;
      child.material.transparent = false;
      child.material.opacity = 1;
      child.frustumCulled = false;
      child.material.needsUpdate = true;
      child.material.depthWrite = true;
      child.material.depthTest = true;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={0.1}
      position={centerPosition}
    />
  );
};

// Camera controller component for orbital movement
const CameraController = () => {
  const orbitControlsRef = useRef();

  // Center point to orbit around - match with model center
  const centerPoint = [-420, 0, 100];

  // No more auto-rotation

  return (
    <OrbitControls
      ref={orbitControlsRef}
      enableZoom={true}
      enablePan={true}
      target={centerPoint}
      maxDistance={200} // Increased from 100
      minDistance={50} // Increased from 1
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.2}
      enableDamping={true}
      dampingFactor={0.05}
      rotateSpeed={0.5}
      // Removed onStart and onEnd handlers
    />
  );
};

export default function Scene() {
  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ position: [-420, 50, 200], fov: 75, near: 0.1, far: 2000 }}
        gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} />
        <hemisphereLight intensity={0.5} />

        {/* Render the Sketchup model */}
        <SketchupModel />

        {/* Use the custom camera controller instead of basic OrbitControls */}
        <CameraController />
      </Canvas>
    </div>
  );
}
