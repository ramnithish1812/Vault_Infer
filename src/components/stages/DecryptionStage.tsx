import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function DecryptionStage({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"noise" | "stabilizing" | "clear">("noise");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("stabilizing"), 2000);
    const t2 = setTimeout(() => setPhase("clear"), 4000);
    const t3 = setTimeout(onComplete, 5500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  const bars = Array.from({ length: 32 }, (_, i) => i);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen px-4"
    >
      <h2 className="text-2xl font-display vault-glow text-primary mb-2">Client-Side Decryption</h2>
      <p className="text-muted-foreground text-xs font-mono mb-8">REMOVING NOISE · RECOVERING PLAINTEXT</p>

      <div className="vault-panel p-6 w-full max-w-lg">
        <div className="flex items-end justify-center gap-1 h-40 mb-4">
          {bars.map(i => {
            const noiseAmp = phase === "noise" ? 80 : phase === "stabilizing" ? 30 : 5;
            return (
              <motion.div
                key={i}
                className="w-2 rounded-t"
                style={{
                  background: phase === "clear"
                    ? "linear-gradient(to top, hsl(var(--vault-cyan)), hsl(var(--vault-electric-blue)))"
                    : phase === "stabilizing"
                    ? "linear-gradient(to top, hsl(var(--primary)), hsl(var(--vault-cyan)))"
                    : "linear-gradient(to top, hsl(var(--destructive)), hsl(var(--primary)))",
                }}
                animate={{
                  height: phase === "clear"
                    ? `${30 + Math.sin(i * 0.4) * 20}%`
                    : `${Math.random() * noiseAmp + 10}%`,
                }}
                transition={{ duration: phase === "noise" ? 0.2 : 0.8, repeat: phase === "clear" ? 0 : Infinity, repeatType: "mirror" }}
              />
            );
          })}
        </div>

        <div className="text-center">
          <motion.p
            className={`font-display text-sm tracking-widest ${
              phase === "clear" ? "text-vault-cyan vault-glow-cyan" :
              phase === "stabilizing" ? "text-secondary-foreground" : "text-destructive vault-glow-red"
            }`}
            animate={phase !== "clear" ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {phase === "noise" ? "REMOVING ENCRYPTION NOISE..." :
             phase === "stabilizing" ? "SIGNAL STABILIZING..." : "✓ DECRYPTION COMPLETE"}
          </motion.p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground font-mono mt-6 text-center max-w-sm">
        Server never accessed plaintext — decryption occurs exclusively on client
      </p>
    </motion.div>
  );
}
