import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HackerStage({ onBack }: { onBack: () => void }) {
  const [attempts, setAttempts] = useState(0);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setAttempts(a => a + 1);
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 1200);
    return () => clearInterval(t);
  }, []);

  const randomHex = (len: number) => Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  const cipherLines = Array.from({ length: 8 }, () => randomHex(48));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen px-4"
      style={glitch ? { animation: "glitch 0.2s ease-in-out" } : {}}
    >
      <motion.h2
        className="text-3xl font-display vault-glow-red text-destructive mb-2"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        ⚠ ACCESS DENIED
      </motion.h2>
      <p className="text-destructive/70 text-xs font-mono mb-8 tracking-widest">ENCRYPTED DATA — DECRYPTION IMPOSSIBLE</p>

      <div className="vault-panel border-destructive/30 p-6 w-full max-w-xl font-mono text-xs space-y-1">
        <div className="text-destructive/60 mb-3">
          {'>'} ATTEMPTING BRUTE FORCE DECRYPTION... [{attempts} attempts]
        </div>
        {cipherLines.map((line, i) => (
          <motion.div
            key={`${i}-${attempts}`}
            className="text-destructive/40 break-all"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 0.8, delay: i * 0.1, repeat: Infinity }}
          >
            0x{randomHex(48)}
          </motion.div>
        ))}
        <div className="mt-4 pt-3 border-t border-destructive/20">
          <motion.span
            className="text-destructive vault-glow-red"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {'>'} DECRYPTION FAILED: INSUFFICIENT KEY MATERIAL
          </motion.span>
        </div>
        <div className="text-destructive/40">
          {'>'} CIPHERTEXT SPACE: 2^128 combinations
          <br />
          {'>'} ESTIMATED TIME TO CRACK: 3.4 × 10²⁸ years
          <br />
          {'>'} STATUS: <span className="text-destructive vault-glow-red">IMPOSSIBLE</span>
        </div>
      </div>

      <motion.div
        className="mt-8 vault-panel border-destructive/20 p-4 text-center max-w-md"
        animate={glitch ? { x: [-3, 3, -1, 0] } : {}}
      >
        <p className="text-xs font-mono text-destructive/70">
          FHE encryption ensures that even with full server access, the attacker cannot recover any plaintext information.
          The data remains encrypted throughout the entire computational pipeline.
        </p>
      </motion.div>

      <button onClick={onBack} className="vault-button mt-8">
        ← RETURN TO OUTPUT
      </button>
    </motion.div>
  );
}
