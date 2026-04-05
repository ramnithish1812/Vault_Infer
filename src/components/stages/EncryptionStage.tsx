import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function EncryptionStage({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0); // 0=encoding, 1=encrypting, 2=ciphertext
  const [noise, setNoise] = useState(45);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 2500);
    const t2 = setTimeout(() => setStep(2), 5000);
    const t3 = setTimeout(onComplete, 7500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  useEffect(() => {
    const i = setInterval(() => setNoise(n => Math.max(10, n - 0.3 + Math.random() * 0.5)), 100);
    return () => clearInterval(i);
  }, []);

  const steps = ["POLYNOMIAL ENCODING", "CKKS ENCRYPTION", "CIPHERTEXT GENERATED"];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen px-4"
    >
      <h2 className="text-2xl font-display vault-glow text-primary mb-2">FHE Encryption</h2>
      <p className="text-muted-foreground text-xs font-mono mb-8">CKKS HOMOMORPHIC ENCRYPTION SCHEME</p>

      {/* Rotating rings visualization */}
      <div className="relative w-48 h-48 mb-8">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border"
            style={{
              borderColor: step >= i ? "hsl(var(--vault-cyan))" : "hsl(var(--vault-neon-purple))",
              inset: `${i * 20}px`,
            }}
            animate={{ rotate: [0, 360 * (i % 2 === 0 ? 1 : -1)] }}
            transition={{ duration: 4 + i * 2, repeat: Infinity, ease: "linear" }}
          />
        ))}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={step === 1 ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <span className="text-2xl">{step === 0 ? "∑" : step === 1 ? "🔐" : "◈"}</span>
        </motion.div>
        {step === 1 && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: "radial-gradient(circle, hsl(0 100% 62% / 0.15), transparent)" }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </div>

      {/* Step indicators */}
      <div className="flex gap-6 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="text-center">
            <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
              i === step ? "bg-vault-cyan shadow-[0_0_10px_hsl(var(--vault-cyan))]" :
              i < step ? "bg-primary" : "bg-muted"
            }`} />
            <span className={`text-[10px] font-display tracking-wider ${i === step ? "text-vault-cyan" : "text-muted-foreground"}`}>
              {s}
            </span>
          </div>
        ))}
      </div>

      {/* Stats panel */}
      <div className="vault-panel p-4 grid grid-cols-3 gap-4 text-center w-full max-w-md">
        <div>
          <div className="text-xs text-muted-foreground font-mono">POLY DEGREE</div>
          <div className="text-lg font-display text-secondary-foreground">8192</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground font-mono">SCALE</div>
          <div className="text-lg font-display text-secondary-foreground">2⁴⁰</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground font-mono">NOISE BUDGET</div>
          <motion.div className="text-lg font-display text-vault-cyan">{noise.toFixed(1)} dB</motion.div>
        </div>
      </div>
    </motion.div>
  );
}
