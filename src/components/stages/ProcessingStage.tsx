import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ProcessingStage({ onComplete }: { onComplete: () => void }) {
  const [activeLayer, setActiveLayer] = useState(0);
  const [sigmoidX, setSigmoidX] = useState(-6);

  useEffect(() => {
    const t = setInterval(() => setActiveLayer(l => (l + 1) % 4), 1500);
    const t2 = setTimeout(onComplete, 7000);
    return () => { clearInterval(t); clearTimeout(t2); };
  }, [onComplete]);

  useEffect(() => {
    const t = setInterval(() => setSigmoidX(x => x >= 6 ? -6 : x + 0.15), 50);
    return () => clearInterval(t);
  }, []);

  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
  const layers = [
    { name: "LINEAR", nodes: 6 },
    { name: "SIGMOID", nodes: 4 },
    { name: "LINEAR", nodes: 4 },
    { name: "OUTPUT", nodes: 3 },
  ];

  // Generate sigmoid curve points
  const curvePoints = Array.from({ length: 60 }, (_, i) => {
    const x = -6 + (i / 59) * 12;
    return { x: 10 + (i / 59) * 80, y: 80 - sigmoid(x) * 60 };
  });
  const pathD = curvePoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen px-4"
    >
      <h2 className="text-2xl font-display vault-glow text-primary mb-2">Neural Processing</h2>
      <p className="text-muted-foreground text-xs font-mono mb-6">FHE COMPUTATION ON ENCRYPTED DATA</p>

      {/* Neural network visualization */}
      <div className="vault-panel p-6 mb-6 w-full max-w-2xl">
        <div className="flex justify-between items-center gap-2">
          {layers.map((layer, li) => (
            <div key={li} className="flex flex-col items-center gap-2">
              <span className={`text-[9px] font-display tracking-wider ${li === activeLayer ? "text-vault-cyan" : "text-muted-foreground"}`}>
                {layer.name}
              </span>
              {Array.from({ length: layer.nodes }, (_, ni) => (
                <motion.div
                  key={ni}
                  className={`w-6 h-6 rounded-full border flex items-center justify-center text-[8px] font-mono ${
                    li === activeLayer
                      ? "border-vault-cyan bg-vault-cyan/20 text-vault-cyan shadow-[0_0_10px_hsl(var(--vault-cyan)/0.4)]"
                      : li < activeLayer ? "border-primary/50 bg-primary/10 text-primary" : "border-muted bg-muted/30 text-muted-foreground"
                  }`}
                  animate={li === activeLayer ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.6, delay: ni * 0.1, repeat: li === activeLayer ? Infinity : 0 }}
                >
                  ◈
                </motion.div>
              ))}
            </div>
          ))}
        </div>
        {/* Connections hint */}
        <div className="mt-3 text-center text-[10px] text-muted-foreground font-mono">
          {activeLayer === 1 ? "σ(x) = 1 / (1 + e^(-x)) — POLYNOMIAL APPROXIMATION FOR FHE" : "ENCRYPTED TENSOR OPERATIONS"}
        </div>
      </div>

      {/* Sigmoid visualization */}
      <div className="vault-panel p-4 w-full max-w-md">
        <div className="text-xs font-display text-secondary-foreground tracking-wider mb-2">SIGMOID ACTIVATION</div>
        <svg viewBox="0 0 100 100" className="w-full h-32">
          {/* Grid */}
          <line x1="10" y1="80" x2="90" y2="80" stroke="hsl(var(--border))" strokeWidth="0.5" />
          <line x1="50" y1="15" x2="50" y2="85" stroke="hsl(var(--border))" strokeWidth="0.5" />
          {/* Curve */}
          <path d={pathD} fill="none" stroke="#5A2391" strokeWidth="1.5" />
          {/* Moving point */}
          <motion.circle
            cx={10 + ((sigmoidX + 6) / 12) * 80}
            cy={80 - sigmoid(sigmoidX) * 60}
            r={2.5}
            fill="#00FFC6"
            style={{ filter: "drop-shadow(0 0 4px #00FFC6)" }}
          />
          <text x="5" y="22" fontSize="4" fill="hsl(var(--muted-foreground))">1.0</text>
          <text x="5" y="82" fontSize="4" fill="hsl(var(--muted-foreground))">0.0</text>
        </svg>
        <p className="text-[10px] text-vault-cyan font-mono text-center vault-glow-cyan">
          FHE computation using polynomial approximation of sigmoid
        </p>
      </div>
    </motion.div>
  );
}
