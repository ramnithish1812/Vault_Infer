import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function EmbeddingStage({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(timer); setTimeout(onComplete, 600); return 100; }
        return p + 2;
      });
    }, 60);
    return () => clearInterval(timer);
  }, [onComplete]);

  const dims = Array.from({ length: 24 }, (_, i) => ({
    value: Math.sin(i * 0.5 + progress * 0.05) * 0.5 + 0.5,
    delay: i * 0.05,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen px-4"
    >
      <h2 className="text-2xl font-display vault-glow text-primary mb-2">Embedding Generation</h2>
      <p className="text-muted-foreground text-xs font-mono mb-8">TRANSFORMING TEXT → 384-DIMENSIONAL VECTOR SPACE</p>

      <div className="vault-panel p-6 w-full max-w-lg">
        <div className="flex gap-1 items-end justify-center h-40 mb-4">
          {dims.map((d, i) => (
            <motion.div
              key={i}
              className="w-2 rounded-t bg-gradient-to-t from-primary to-vault-cyan"
              initial={{ height: 0 }}
              animate={{ height: `${d.value * 100}%` }}
              transition={{ delay: d.delay, duration: 0.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }}
              style={{ opacity: 0.5 + d.value * 0.5 }}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs font-mono text-muted-foreground">
          <span>dim_0</span><span>dim_383</span>
        </div>
      </div>

      <div className="mt-6 w-full max-w-lg">
        <div className="flex justify-between text-xs font-mono text-muted-foreground mb-1">
          <span>ENCODING PROGRESS</span><span>{progress}%</span>
        </div>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-primary to-vault-cyan rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </motion.div>
  );
}
