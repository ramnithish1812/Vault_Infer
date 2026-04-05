import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  onSubmit: (text: string) => void;
}

export default function InputStage({ onSubmit }: Props) {
  const [text, setText] = useState("");
  const [scanning, setScanning] = useState(false);

  const handleSubmit = () => {
    if (!text.trim()) return;
    setScanning(true);
    setTimeout(() => onSubmit(text), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      className="flex flex-col items-center justify-center min-h-screen px-4"
    >
      <motion.h1
        className="text-3xl md:text-5xl font-display font-bold vault-glow mb-2 text-primary"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        Vault Infer
      </motion.h1>
      <p className="text-muted-foreground font-mono text-sm mb-10 tracking-widest">
        PRIVACY-PRESERVING AI · FHE PIPELINE
      </p>

      <div className="vault-panel p-8 w-full max-w-xl relative">
        {scanning && (
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-vault-cyan"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
        <label className="text-xs font-display tracking-widest text-secondary-foreground mb-3 block">
          SECURE INPUT TERMINAL
        </label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter your message for encrypted inference..."
          className="w-full bg-background/50 border border-border rounded p-4 text-foreground font-mono text-sm resize-none h-32 focus:outline-none focus:border-primary focus:shadow-[0_0_15px_hsl(var(--vault-neon-purple)/0.3)] transition-all"
        />
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-muted-foreground font-mono">
            {scanning ? "⟳ IDENTITY VERIFICATION..." : `${text.length} chars · AES-256 ready`}
          </span>
          <button onClick={handleSubmit} disabled={!text.trim() || scanning} className="vault-button disabled:opacity-30">
            {scanning ? "SCANNING..." : "ENCRYPT & INFER"}
          </button>
        </div>
      </div>

      {/* Fingerprint decoration */}
      <motion.div
        className="mt-12 w-24 h-24 rounded-full border border-primary/20"
        style={{
          background: "radial-gradient(circle, hsl(270 60% 50% / 0.1), transparent)",
          boxShadow: "0 0 40px hsl(270 60% 50% / 0.1)",
        }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-full h-full flex items-center justify-center text-primary/40 text-3xl">⊙</div>
      </motion.div>
    </motion.div>
  );
}
