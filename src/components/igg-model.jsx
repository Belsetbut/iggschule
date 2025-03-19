"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

const SketchupModel = () => {
  const { scene } = useGLTF("/models/IGG.glb");
  const modelRef = useRef();

  // Define the center position of the model
  const centerPosition = [-440, -100, 100];

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
  const centerPoint = [0, -100, 0]; // Updated to match model position

  // Zoom configuration - easy to adjust
  const zoomConfig = {
    minDistance: 100, // Minimum zoom (closer to object)
    maxDistance: 500, // Maximum zoom (further from object)
    zoomSpeed: 1.2, // How fast zooming occurs
  };

  // Update controls on each frame to prevent clipping
  useFrame(() => {
    if (orbitControlsRef.current) {
      // Ensure camera doesn't clip through the building
      const currentPos = orbitControlsRef.current.object.position;
      const buildingPos = centerPoint;

      // Calculate distance to building center
      const distanceToBuilding = Math.sqrt(
        Math.pow(currentPos.x - buildingPos[0], 2) +
          Math.pow(currentPos.y - buildingPos[1], 2) +
          Math.pow(currentPos.z - buildingPos[2], 2)
      );

      // If too close to building, move camera back
      if (distanceToBuilding < zoomConfig.minDistance) {
        // Normalize direction vector
        const dirX = (currentPos.x - buildingPos[0]) / distanceToBuilding;
        const dirY = (currentPos.y - buildingPos[1]) / distanceToBuilding;
        const dirZ = (currentPos.z - buildingPos[2]) / distanceToBuilding;

        // Set position at minimum distance
        orbitControlsRef.current.object.position.set(
          buildingPos[0] + dirX * zoomConfig.minDistance,
          buildingPos[1] + dirY * zoomConfig.minDistance,
          buildingPos[2] + dirZ * zoomConfig.minDistance
        );
      }
    }
  });

  return (
    <OrbitControls
      ref={orbitControlsRef}
      enableZoom={true}
      enablePan={true}
      target={centerPoint}
      maxDistance={zoomConfig.maxDistance}
      minDistance={zoomConfig.minDistance}
      zoomSpeed={zoomConfig.zoomSpeed}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.2}
      enableDamping={true}
      dampingFactor={0.05}
      rotateSpeed={0.5}
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
