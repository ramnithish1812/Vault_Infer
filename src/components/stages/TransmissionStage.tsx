import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function TransmissionStage({ onComplete }: { onComplete: () => void }) {
  const [intercepted, setIntercepted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(timer); setTimeout(onComplete, 1000); return 100; }
        return p + 1.5;
      });
    }, 80);
    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    if (progress > 40 && progress < 55) setIntercepted(true);
    else setIntercepted(false);
  }, [progress]);

  // Simple globe visualization with CSS
  const nodes = Array.from({ length: 8 }, (_, i) => ({
    x: 50 + 35 * Math.cos((i / 8) * Math.PI * 2),
    y: 50 + 35 * Math.sin((i / 8) * Math.PI * 2),
  }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen px-4"
    >
      <h2 className="text-2xl font-display vault-glow text-primary mb-2">Secure Transmission</h2>
      <p className="text-muted-foreground text-xs font-mono mb-8">ENCRYPTED DATA TRAVERSING NETWORK</p>

      {/* Globe visualization */}
      <div className="relative w-64 h-64 mb-6">
        <motion.div
          className="absolute inset-0 rounded-full border border-primary/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
          {/* Connection lines */}
          {nodes.map((n, i) => (
            <motion.line
              key={i}
              x1={50} y1={50} x2={n.x} y2={n.y}
              stroke={intercepted && i === 3 ? "#FF3B3B" : "#00FFC6"}
              strokeWidth={0.5}
              opacity={0.4}
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
          {/* Nodes */}
          {nodes.map((n, i) => (
            <motion.circle
              key={`n${i}`}
              cx={n.x} cy={n.y} r={2}
              fill={intercepted && i === 3 ? "#FF3B3B" : "#00FFC6"}
              animate={{ r: [1.5, 2.5, 1.5] }}
              transition={{ duration: 1, delay: i * 0.15, repeat: Infinity }}
            />
          ))}
          {/* Data packet */}
          <motion.circle
            cx={50} cy={50} r={4}
            fill="#5A2391"
            stroke="#00FFC6"
            strokeWidth={1}
            animate={{
              cx: [50, nodes[Math.floor(progress / 12.5) % 8]?.x ?? 50],
              cy: [50, nodes[Math.floor(progress / 12.5) % 8]?.y ?? 50],
            }}
            transition={{ duration: 1 }}
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center border border-border">
            <span className="text-xs font-display text-secondary-foreground">FHE</span>
          </div>
        </div>
      </div>

      {/* Interception alert */}
      {intercepted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="vault-panel border-destructive/50 p-4 mb-6 text-center max-w-md"
        >
          <p className="text-destructive font-display text-sm vault-glow-red tracking-wider">
            ⚠ INTERCEPTION ATTEMPTED
          </p>
          <p className="text-vault-cyan font-mono text-xs mt-1 vault-glow-cyan">
            DATA ENCRYPTED — INTERCEPTION FAILED
          </p>
        </motion.div>
      )}

      <div className="w-full max-w-md">
        <div className="flex justify-between text-xs font-mono text-muted-foreground mb-1">
          <span>TRANSMISSION</span><span>{progress.toFixed(0)}%</span>
        </div>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${intercepted ? "bg-destructive" : "bg-gradient-to-r from-vault-cyan to-vault-electric-blue"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
