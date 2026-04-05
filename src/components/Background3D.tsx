import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function ParticleField() {
  const ref = useRef<THREE.Points>(null!);
  const count = 800;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.02;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.01) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#5A2391" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function NeonGrid() {
  const ref = useRef<THREE.GridHelper>(null!);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.z = (clock.getElapsedTime() * 0.5) % 2;
    }
  });
  return <gridHelper ref={ref} args={[60, 60, "#3B1670", "#1A0A3A"]} position={[0, -5, 0]} />;
}

function FloatingRings() {
  const group = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.x = clock.getElapsedTime() * 0.1;
      group.current.rotation.z = clock.getElapsedTime() * 0.05;
    }
  });
  return (
    <group ref={group} position={[0, 0, -10]}>
      {[3, 4.5, 6].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.3, i * 0.5, 0]}>
          <torusGeometry args={[r, 0.02, 16, 100]} />
          <meshBasicMaterial color="#5A2391" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }} gl={{ alpha: true, antialias: true }}>
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 15, 45]} />
        <ambientLight intensity={0.2} />
        <ParticleField />
        <NeonGrid />
        <FloatingRings />
      </Canvas>
      <div className="scanline" />
    </div>
  );
}
