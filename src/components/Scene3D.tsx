import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Sphere, MeshDistortMaterial, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from "three";

function NeuralGrid({ count = 1000, scrollProgress }: { count?: number; scrollProgress: any }) {
  // Reduce count on mobile/low-perf devices
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const finalCount = isMobile ? Math.floor(count / 3) : count;

  const points = useMemo(() => {
    const p = new Float32Array(finalCount * 3);
    for (let i = 0; i < finalCount; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20;
      p[i * 3 + 1] = (Math.random() - 0.5) * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return p;
  }, [finalCount]);

  const ref = useRef<THREE.Points>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const scroll = scrollProgress?.get() || 0;

    ref.current.rotation.y = time * 0.05 + scroll * 0.5;
    ref.current.rotation.z = time * 0.02;

    const mouseX = state.mouse.x * 0.5;
    const mouseY = state.mouse.y * 0.5;
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, mouseX, 0.05);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, mouseY, 0.05);
  });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#3b82f6"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.6}
      />
    </Points>
  );
}

function TechCore({ scrollProgress }: { scrollProgress: any }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const scroll = scrollProgress?.get() || 0;

    groupRef.current.rotation.y = time * 0.2 + scroll * 1.5;
    groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.2 - scroll * 1;

    if (meshRef.current) {
      meshRef.current.rotation.z = time * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer Wireframe Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#3b82f6"
          wireframe
          transparent
          opacity={0.3}
          emissive="#3b82f6"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Inner Distorted Core */}
      <Sphere args={[1.2, 64, 64]}>
        <MeshDistortMaterial
          color="#6366f1"
          speed={3}
          distort={0.4}
          radius={1.2}
          emissive="#4338ca"
          emissiveIntensity={1}
        />
      </Sphere>

      {/* Glowing Rings */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / (i + 1.5), i, 0]}>
          <torusGeometry args={[2.5 + i * 0.2, 0.02, 16, 100]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={2}
          />
        </mesh>
      ))}
    </group>
  );
}

const Scene3D = ({ scrollProgress }: { scrollProgress: any }) => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#3b82f6" intensity={1} />

        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <NeuralGrid scrollProgress={scrollProgress} />
          <TechCore scrollProgress={scrollProgress} />
        </Float>

        <fog attach="fog" args={["#000", 5, 20]} />
      </Canvas>
    </div>
  );
};

export default Scene3D;
