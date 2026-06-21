import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

/* ----------------------------- 3D primitives ----------------------------- */

const WireCore = ({
  progress,
  exiting,
  isMobile,
}: {
  progress: number;
  exiting: boolean;
  isMobile: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    // Cap delta to avoid jumps after tab switches
    const d = Math.min(delta, 0.05);
    if (groupRef.current) {
      groupRef.current.rotation.y += d * 0.4;
      groupRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.15;

      // Smooth zoom-in on exit (handing off to landing page)
      const targetScale = exiting ? 8 : 1;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.06
      );
    }
    if (innerRef.current) {
      innerRef.current.rotation.x -= d * 0.5;
      innerRef.current.rotation.z += d * 0.25;
      const s = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.04;
      innerRef.current.scale.setScalar(s);
    }
    if (ringRef.current) ringRef.current.rotation.z += d * 0.6;
    if (ring2Ref.current && !isMobile) {
      ring2Ref.current.rotation.x += d * 0.4;
      ring2Ref.current.rotation.y -= d * 0.5;
    }
  });

  const intensity = 0.4 + (progress / 100) * 0.6;
  const detail = isMobile ? 0 : 1;

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[1.6, detail]} />
        <meshBasicMaterial
          color="#0EA5E9"
          wireframe
          transparent
          opacity={0.35 + intensity * 0.35}
        />
      </mesh>

      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.7, 0]} />
        <meshBasicMaterial
          color="#67E8F9"
          wireframe
          transparent
          opacity={0.6 + intensity * 0.4}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.22, isMobile ? 10 : 16, isMobile ? 10 : 16]} />
        <meshBasicMaterial color="#A5F3FC" transparent opacity={intensity} />
      </mesh>

      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.1, 0.005, 6, isMobile ? 48 : 96]} />
        <meshBasicMaterial color="#0EA5E9" transparent opacity={0.6} />
      </mesh>

      {!isMobile && (
        <mesh ref={ring2Ref}>
          <torusGeometry args={[2.4, 0.003, 6, 96]} />
          <meshBasicMaterial color="#0EA5E9" transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  );
};

const ParticleField = ({
  count,
  exiting,
}: {
  count: number;
  exiting: boolean;
}) => {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    if (ref.current) {
      ref.current.rotation.y += d * 0.04;
      ref.current.rotation.x += d * 0.015;
      const target = exiting ? 4 : 1;
      ref.current.scale.lerp(
        new THREE.Vector3(target, target, target),
        0.05
      );
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#38BDF8"
        size={0.024}
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
};

const CameraDolly = ({ exiting }: { exiting: boolean }) => {
  const { camera } = useThree();
  useFrame(() => {
    const targetZ = exiting ? 1.2 : 5;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.updateProjectionMatrix();
  });
  return null;
};

/* --------------------------------- Loader -------------------------------- */

const bootLines = [
  "Booting Starklabs runtime",
  "Loading AI engineering stack",
  "Compiling product modules",
  "Linking Future AI Club",
  "Initializing StarkLedger node",
  "Calibrating Neural Tarot model",
  "Syncing Habit Tracker telemetry",
  "Establishing secure enterprise channel",
  "Rendering interface",
];

const PageLoader = () => {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);

  // Respect reduced-motion: still show briefly, but skip heavy work
  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    const tick = prefersReducedMotion ? 60 : 110;
    const step = prefersReducedMotion ? 18 : 11;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          // Trigger 3D zoom-in transition, then unmount overlay
          setExiting(true);
          setTimeout(() => setLoading(false), 900);
          return 100;
        }
        return Math.min(100, prev + Math.random() * step);
      });
    }, tick);
    return () => clearInterval(timer);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const i = setInterval(() => {
      setLogIndex((p) => (p + 1) % bootLines.length);
    }, 480);
    return () => clearInterval(i);
  }, []);

  const particleCount = isMobile ? 60 : 180;
  const dprCap: [number, number] = isMobile ? [1, 1.25] : [1, 1.75];

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{
            opacity: exiting ? 0 : 1,
            filter: exiting ? "blur(14px)" : "blur(0px)",
          }}
          transition={{ duration: 0.9, ease: [0.6, 0.05, 0.2, 0.95] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden"
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage:
                "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            }}
          />

          {/* Scan line — disabled on mobile to save GPU */}
          {!isMobile && (
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: "100vh" }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none"
            />
          )}

          {/* 3D Canvas */}
          <div className="absolute inset-0">
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              dpr={dprCap}
              gl={{
                antialias: !isMobile,
                alpha: true,
                powerPreference: "high-performance",
              }}
              frameloop={prefersReducedMotion ? "demand" : "always"}
            >
              <CameraDolly exiting={exiting} />
              <WireCore
                progress={progress}
                exiting={exiting}
                isMobile={isMobile}
              />
              <ParticleField count={particleCount} exiting={exiting} />
            </Canvas>
          </div>

          {/* Radial vignette that fades during exit to reveal landing page */}
          <motion.div
            animate={{ opacity: exiting ? 0 : 1 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 40%, hsl(var(--background)) 90%)",
            }}
          />

          {/* HUD */}
          <motion.div
            animate={{ opacity: exiting ? 0 : 1, y: exiting ? -10 : 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex flex-col items-center pointer-events-none"
          >
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
          </motion.div>

          {/* Bottom HUD */}
          <motion.div
            animate={{ opacity: exiting ? 0 : 1, y: exiting ? 10 : 0 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-8 inset-x-8 flex flex-col gap-3 z-10 pointer-events-none"
          >
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
              <div className="hidden sm:flex gap-4 text-muted-foreground/60">
                <span>SYS_v4.0.2</span>
                <span className="text-primary">● ONLINE</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;
