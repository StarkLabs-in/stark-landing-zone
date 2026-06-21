import { useState, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// WebGL availability checker
function isWebGLAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

// -------------------------------------------------------------
// THREE.JS SUB-COMPONENTS
// -------------------------------------------------------------

function FlyingParticles({ count = 250 }) {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 25; // X
      p[i * 3 + 1] = (Math.random() - 0.5) * 20; // Y
      p[i * 3 + 2] = (Math.random() - 0.5) * 35; // Z
    }
    return p;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = time * 0.02;
      ref.current.rotation.x = time * 0.01;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#06b6d4"
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.4}
      />
    </Points>
  );
}

function NeuralConstellations({ nodesCount = 20 }) {
  const groupRef = useRef<THREE.Group>(null!);

  // Generate node positions in space
  const positions = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    for (let i = 0; i < nodesCount; i++) {
      arr.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 10
        )
      );
    }
    return arr;
  }, [nodesCount]);

  // Construct lines connecting close nodes
  const linePositions = useMemo(() => {
    const points: number[] = [];
    for (let i = 0; i < nodesCount; i++) {
      for (let j = i + 1; j < nodesCount; j++) {
        const dist = positions[i].distanceTo(positions[j]);
        if (dist < 4.5) {
          points.push(positions[i].x, positions[i].y, positions[i].z);
          points.push(positions[j].x, positions[j].y, positions[j].z);
        }
      }
    }
    return new Float32Array(points);
  }, [positions, nodesCount]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.03;
      groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Node Spheres */}
      {positions.map((pos, idx) => (
        <mesh key={idx} position={[pos.x, pos.y, pos.z]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial
            color={idx % 3 === 0 ? "#f59e0b" : idx % 2 === 0 ? "#06b6d4" : "#3b82f6"}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* Network Lines */}
      {linePositions.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[linePositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#3b82f6" transparent opacity={0.2} />
        </lineSegments>
      )}
    </group>
  );
}

function HolographicGlassCard({ position, rotation, width = 2.4, height = 1.5 }: { position: [number, number, number]; rotation: [number, number, number]; width?: number; height?: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const planeGeom = useMemo(() => new THREE.PlaneGeometry(width, height), [width, height]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(time * 0.7 + position[0]) * 0.12;
      meshRef.current.rotation.y = rotation[1] + Math.cos(time * 0.3) * 0.04;
      meshRef.current.rotation.x = rotation[0] + Math.sin(time * 0.2) * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <primitive object={planeGeom} />
      <meshPhysicalMaterial
        color="#020617"
        roughness={0.2}
        metalness={0.9}
        transparent
        opacity={0.35}
        transmission={0.65}
        thickness={0.8}
        clearcoat={1}
        clearcoatRoughness={0.1}
        side={THREE.DoubleSide}
      />
      {/* Outer Holographic Border */}
      <lineSegments>
        <edgesGeometry attach="geometry" args={[planeGeom]} />
        <lineBasicMaterial attach="material" color="#06b6d4" transparent opacity={0.3} />
      </lineSegments>
    </mesh>
  );
}

function HolographicGridScanner() {
  const gridRef = useRef<THREE.GridHelper>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (gridRef.current) {
      gridRef.current.rotation.y = time * 0.015;
    }
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[35, 35, "#06b6d4", "#1e293b"]}
      position={[0, -4.5, 0]}
    />
  );
}

// -------------------------------------------------------------
// CAMERA CONTROLLER
// -------------------------------------------------------------

function CameraController({ isIntro }: { isIntro: boolean }) {
  const startTimeRef = useRef<number | null>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (startTimeRef.current === null) {
      startTimeRef.current = time;
    }

    const elapsed = time - startTimeRef.current;
    let targetZ = 8;
    let targetX = 0;
    let targetY = 0;

    if (isIntro) {
      // Intro fly-through: camera moves Z=30 down to Z=8.5 over 2 seconds
      const progress = Math.min(elapsed / 2.0, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      targetZ = 30 - easeProgress * (30 - 8.5);

      // Subtle spiral fly-by sway
      targetX = Math.sin(elapsed * 4) * 0.3 * (1 - easeProgress);
      targetY = Math.cos(elapsed * 4) * 0.3 * (1 - easeProgress);
    } else {
      // Hero active layout: settle at Z=8 with fine cursor mapping
      targetZ = 8.2 + Math.sin(time * 0.4) * 0.15;
      targetX = state.mouse.x * 1.6;
      targetY = state.mouse.y * 1.1;
    }

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);

    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

// -------------------------------------------------------------
// CSS FALLBACK COMPONENT (For non-WebGL clients)
// -------------------------------------------------------------

function CSSFallbackParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 2}px`,
      delay: `${Math.random() * 6}s`,
      duration: `${Math.random() * 12 + 10}s`,
      opacity: Math.random() * 0.3 + 0.1,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-slate-950/90">
      {/* Fallback CSS Keyframes injection */}
      <style>{`
        @keyframes css-float-up {
          0% {
            transform: translateY(105vh) scale(0.6) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: var(--p-opacity, 0.3);
          }
          85% {
            opacity: var(--p-opacity, 0.3);
          }
          100% {
            transform: translateY(-10vh) scale(1.2) rotate(360deg);
            opacity: 0;
          }
        }
        .css-fallback-particle {
          position: absolute;
          bottom: -20px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #06b6d4, #3b82f6);
          animation: css-float-up var(--p-duration, 15s) linear infinite;
          animation-delay: var(--p-delay, 0s);
        }
      `}</style>

      {/* Futuristic Background grid for fallback */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950 pointer-events-none" />

      {particles.map((p) => (
        <div
          key={p.id}
          className="css-fallback-particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            // @ts-ignore
            "--p-duration": p.duration,
            "--p-delay": p.delay,
            "--p-opacity": p.opacity,
            filter: "blur(0.5px) drop-shadow(0 0 3px rgba(6, 182, 212, 0.3))",
          }}
        />
      ))}
    </div>
  );
}

// -------------------------------------------------------------
// MAIN COMPONENT
// -------------------------------------------------------------

interface FutureAiClubSceneProps {
  isIntro: boolean;
}

export default function FutureAiClubScene({ isIntro }: FutureAiClubSceneProps) {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    setHasWebGL(isWebGLAvailable());
  }, []);

  if (hasWebGL === null) {
    return <div className="absolute inset-0 bg-slate-950 z-0 pointer-events-none" />;
  }

  if (hasWebGL === false) {
    return <CSSFallbackParticles />;
  }

  return (
    <div className="absolute inset-0 z-0 pointer-events-none bg-slate-950 select-none">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
        camera={{ fov: 55, near: 0.1, far: 100 }}
      >
        <color attach="background" args={["#020617"]} />
        <fog attach="fog" args={["#020617", 4, 18]} />

        {/* Ambient & Directional Lights */}
        <ambientLight intensity={0.25} />
        <directionalLight position={[5, 10, 5]} intensity={0.5} color="#ffffff" />
        <pointLight position={[-8, 4, -4]} intensity={0.6} color="#06b6d4" />
        <pointLight position={[8, -4, 4]} intensity={0.5} color="#f59e0b" />

        {/* 3D Elements */}
        <FlyingParticles count={220} />
        <NeuralConstellations nodesCount={22} />
        <HolographicGridScanner />

        {/* Holographic framing cards */}
        <HolographicGlassCard position={[-3.6, 1.6, -1]} rotation={[0.1, 0.25, 0]} width={2.2} height={1.4} />
        <HolographicGlassCard position={[3.6, -1.8, -1]} rotation={[-0.15, -0.2, 0]} width={2.4} height={1.5} />

        {/* Camera interpolation script */}
        <CameraController isIntro={isIntro} />
      </Canvas>
    </div>
  );
}
