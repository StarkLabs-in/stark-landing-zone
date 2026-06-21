import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const WireCore = ({ progress }: { progress: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x -= delta * 0.6;
      innerRef.current.rotation.z += delta * 0.3;
      const s = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      innerRef.current.scale.setScalar(s);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.8;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x += delta * 0.5;
      ring2Ref.current.rotation.y -= delta * 0.7;
    }
  });

  const intensity = 0.4 + (progress / 100) * 0.6;

  return (
    <group ref={groupRef}>
      {/* Outer wireframe icosahedron */}
      <mesh>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.15 + intensity * 0.25}
        />
      </mesh>

      {/* Inner glowing core */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.7, 0]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.6 + intensity * 0.4}
        />
      </mesh>

      {/* Solid core */}
      <mesh>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={intensity} />
      </mesh>

      {/* Orbital ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.1, 0.005, 8, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
      </mesh>

      {/* Second orbital ring */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.4, 0.003, 8, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

const ParticleField = () => {
  const ref = useRef<THREE.Points>(null);
  const count = 200;
  const positions = useRef<Float32Array>();

  if (!positions.current) {
    positions.current = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions.current[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions.current[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions.current[i * 3 + 2] = r * Math.cos(phi);
    }
  }

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.05;
      ref.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.025}
        sizeAttenuation
        transparent
        opacity={0.7}
      />
    </points>
  );
};

const bootLines = [
  "Initializing kernel...",
  "Mounting neural cortex",
  "Calibrating shaders",
  "Linking AI subsystems",
  "Establishing secure channel",
  "Compiling render pipeline",
  "Synchronizing nodes",
  "Bootstrapping interface",
];

const PageLoader = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 700);
          return 100;
        }
        return Math.min(100, prev + Math.random() * 12);
      });
    }, 120);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const i = setInterval(() => {
      setLogIndex((p) => (p + 1) % bootLines.length);
    }, 450);
    return () => clearInterval(i);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            filter: "blur(20px)",
            transition: { duration: 0.9, ease: [0.6, 0.05, 0.2, 0.95] },
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden"
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage:
                "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            }}
          />

          {/* Scan line */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: "100vh" }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none"
          />

          {/* 3D Canvas */}
          <div className="absolute inset-0">
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
            >
              <WireCore progress={progress} />
              <ParticleField />
            </Canvas>
          </div>

          {/* HUD Overlay */}
          <div className="relative z-10 flex flex-col items-center pointer-events-none">
            {/* Corner brackets */}
            <div className="absolute -inset-x-32 -inset-y-24 pointer-events-none">
              {["tl", "tr", "bl", "br"].map((c) => (
                <div
                  key={c}
                  className={`absolute w-8 h-8 border-primary/60 ${
                    c === "tl"
                      ? "top-0 left-0 border-t-2 border-l-2"
                      : c === "tr"
                      ? "top-0 right-0 border-t-2 border-r-2"
                      : c === "bl"
                      ? "bottom-0 left-0 border-b-2 border-l-2"
                      : "bottom-0 right-0 border-b-2 border-r-2"
                  }`}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-64 flex flex-col items-center gap-3"
            >
              <span className="text-[10px] font-mono text-primary uppercase tracking-[0.4em]">
                Rendering Reality
              </span>
              <span className="font-display text-2xl font-light tracking-widest text-foreground">
                STARK<span className="text-primary">LABS</span>
              </span>
            </motion.div>
          </div>

          {/* Bottom HUD */}
          <div className="absolute bottom-8 inset-x-8 flex flex-col gap-3 z-10 pointer-events-none">
            {/* Progress bar */}
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest min-w-[60px]">
                Load
              </span>
              <div className="relative flex-1 h-[2px] bg-primary/10 overflow-hidden">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.3 }}
                  className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_12px_hsl(var(--primary))]"
                />
              </div>
              <span className="text-[11px] font-mono text-primary tabular-nums min-w-[50px] text-right">
                {Math.round(progress).toString().padStart(3, "0")}%
              </span>
            </div>

            {/* Boot log */}
            <div className="flex justify-between items-center font-mono text-[10px] uppercase tracking-widest">
              <motion.span
                key={logIndex}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-muted-foreground"
              >
                <span className="text-primary mr-2">{">"}</span>
                {bootLines[logIndex]}
              </motion.span>
              <div className="flex gap-4 text-muted-foreground/60">
                <span>SYS_v4.0.2</span>
                <span className="text-primary">● ONLINE</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;
