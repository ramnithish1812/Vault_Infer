import { motion } from "framer-motion";

const STAGES = [
  "INPUT", "EMBEDDING", "ENCRYPTION", "TRANSMISSION",
  "PROCESSING", "DECRYPTION", "OUTPUT", "HACKER VIEW"
];

interface Props {
  currentStage: number;
}

export default function StageIndicator({ currentStage }: Props) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-1 py-3 px-4 bg-background/80 backdrop-blur-md border-b border-border">
      {STAGES.map((stage, i) => (
        <div key={stage} className="flex items-center">
          <motion.div
            className={`h-2 w-2 rounded-full transition-colors duration-300 ${
              i === currentStage ? "bg-vault-cyan shadow-[0_0_8px_hsl(165,100%,50%)]" :
              i < currentStage ? "bg-primary" : "bg-muted"
            }`}
            animate={i === currentStage ? { scale: [1, 1.4, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <span className={`text-[9px] font-display ml-1 tracking-wider hidden lg:inline ${
            i === currentStage ? "text-vault-cyan" : i < currentStage ? "text-secondary-foreground" : "text-muted-foreground"
          }`}>
            {stage}
          </span>
          {i < STAGES.length - 1 && <div className={`w-4 h-px mx-1 ${i < currentStage ? "bg-primary" : "bg-muted"}`} />}
        </div>
      ))}
    </div>
  );
}
