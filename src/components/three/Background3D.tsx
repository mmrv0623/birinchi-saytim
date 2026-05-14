"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";

function Particles({ count = 1400 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const palette = [
      new THREE.Color("#22d3ee"),
      new THREE.Color("#8b5cf6"),
      new THREE.Color("#ec4899"),
      new THREE.Color("#3b82f6"),
    ];
    for (let i = 0; i < count; i++) {
      const r = 18 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi) - 6;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      sizes[i] = 0.02 + Math.random() * 0.05;
    }
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return g;
  }, [count]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.03;
    ref.current.rotation.x += delta * 0.01;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        vertexColors
        size={0.07}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function HoloGrid() {
  const ref = useRef<THREE.GridHelper>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.z = (ref.current.position.z + delta * 0.6) % 4;
  });
  return (
    <>
      <gridHelper
        ref={ref}
        args={[60, 60, "#22d3ee", "#3b82f6"]}
        position={[0, -3.5, -4]}
        rotation={[0, 0, 0]}
      />
      <gridHelper
        args={[60, 60, "#8b5cf6", "#1e293b"]}
        position={[0, 7.5, -6]}
        rotation={[Math.PI, 0, 0]}
      />
    </>
  );
}

function FloatingCube({
  position,
  color,
  scale,
  speed,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * speed;
    ref.current.rotation.y += delta * speed * 0.8;
    ref.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * speed * 0.7) * 0.4;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        transparent
        opacity={0.18}
        wireframe
      />
    </mesh>
  );
}

function GlowingRing({
  position,
  color,
  speed,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  speed: number;
  scale?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.z += delta * speed;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.4;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <torusGeometry args={[2.2, 0.025, 16, 120]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2.2}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

function CameraParallax({ strength = 0.45 }: { strength?: number }) {
  const { camera, size } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / size.width) * 2 - 1;
      mouse.current.y = -(e.clientY / size.height) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [size.width, size.height]);
  useFrame(() => {
    camera.position.x += (mouse.current.x * strength - camera.position.x) * 0.04;
    camera.position.y += (mouse.current.y * strength - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Background3D() {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setEnabled(false);
  }, []);

  if (!enabled) {
    return (
      <div
        aria-hidden
        className="fixed inset-0 -z-10 grid-bg opacity-30 pointer-events-none"
      />
    );
  }

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        background:
          "radial-gradient(800px 500px at 10% 10%, rgba(34,211,238,0.05), transparent 70%), radial-gradient(900px 500px at 90% 90%, rgba(139,92,246,0.06), transparent 70%)",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={["#04060d"]} />
        <fog attach="fog" args={["#04060d", 12, 28]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 6, 6]} intensity={1.4} color="#22d3ee" />
        <pointLight position={[-10, -4, 4]} intensity={1.2} color="#8b5cf6" />
        <pointLight position={[0, 8, -4]} intensity={0.8} color="#ec4899" />

        <Particles count={1200} />
        <HoloGrid />

        <FloatingCube position={[-5, 2, -2]} color="#22d3ee" scale={0.9} speed={0.35} />
        <FloatingCube position={[5.5, -1.5, -3]} color="#8b5cf6" scale={0.7} speed={0.55} />
        <FloatingCube position={[2, 3.2, -5]} color="#ec4899" scale={0.5} speed={0.7} />
        <FloatingCube position={[-3, -2.5, -1]} color="#3b82f6" scale={0.6} speed={0.45} />

        <GlowingRing position={[0, 0, -4]} color="#22d3ee" speed={0.3} scale={1.4} />
        <GlowingRing position={[0, 0, -4]} color="#8b5cf6" speed={-0.5} scale={1.05} />
        <GlowingRing position={[0, 0, -4]} color="#ec4899" speed={0.7} scale={0.7} />

        <CameraParallax />
      </Canvas>
    </div>
  );
}
