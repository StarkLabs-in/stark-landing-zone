import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleField({ count = 2000, scrollProgress }: { count?: number; scrollProgress: any }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 15;
      p[i * 3 + 1] = (Math.random() - 0.5) * 15;
      p[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const scroll = scrollProgress?.get() || 0;

    ref.current.rotation.x = time * 0.02 + scroll * 0.5;
    ref.current.rotation.y = time * 0.03 + scroll * 0.8;

    // Mouse interaction
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
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.4}
      />
    </Points>
  );
}

function FloatingShape({ scrollProgress }: { scrollProgress: any }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const scroll = scrollProgress?.get() || 0;
    ref.current.rotation.x = time * 0.2 + scroll * 2;
    ref.current.rotation.y = time * 0.3 + scroll * 1.5;
    ref.current.position.y = Math.sin(time * 0.5) * 0.5 - scroll * 2;
  });

  return (
    <Sphere ref={ref} args={[1, 64, 64]} position={[3, 1, -2]}>
      <MeshDistortMaterial
        color="#6366f1"
        speed={2}
        distort={0.4}
        radius={1}
        emissive="#4338ca"
        emissiveIntensity={0.5}
      />
    </Sphere>
  );
}

const Scene3D = ({ scrollProgress }: { scrollProgress: any }) => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#3b82f6" intensity={0.5} />
        <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
          <ParticleField scrollProgress={scrollProgress} />
        </Float>
        <FloatingShape scrollProgress={scrollProgress} />
        <Float speed={2} rotationIntensity={2} floatIntensity={2}>
          <Sphere args={[0.5, 32, 32]} position={[-4, -2, -1]}>
            <MeshDistortMaterial color="#3b82f6" speed={3} distort={0.6} />
          </Sphere>
        </Float>
      </Canvas>
    </div>
  );
};

export default Scene3D;
