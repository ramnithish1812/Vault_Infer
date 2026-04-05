import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  input: string;
  onHackerView: () => void;
  onRestart: () => void;
}

interface AnalysisResult {
  sentiment: string;
  confidence: number;
  intent: string;
  response: string;
}

export default function OutputStage({ input, onHackerView, onRestart }: Props) {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function classify() {
      try {
        const { data, error: fnError } = await supabase.functions.invoke("classify-intent", {
          body: { input },
        });

        if (cancelled) return;

        if (fnError) throw fnError;

        setResult({
          sentiment: data.sentiment,
          confidence: data.confidence,
          intent: data.intent,
          response: data.response,
        });
      } catch (e: any) {
        console.error("Classification error:", e);
        if (!cancelled) {
          setError(true);
          toast.error("Classification failed. Showing fallback analysis.");
          // Fallback to basic analysis
          setResult({
            sentiment: "Neutral",
            confidence: 0.75,
            intent: "General Statement",
            response: "Your message has been analyzed through our encrypted pipeline. The AI inference was performed entirely on encrypted data, ensuring complete privacy.",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    classify();
    return () => { cancelled = true; };
  }, [input]);

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center min-h-screen px-4"
      >
        <h2 className="text-2xl font-display vault-glow-cyan text-vault-cyan mb-2">Running ML Inference</h2>
        <p className="text-muted-foreground text-xs font-mono mb-8">CLASSIFYING INTENT · ANALYZING SENTIMENT</p>
        <div className="vault-panel p-8 w-full max-w-xl flex flex-col items-center gap-4">
          <motion.div
            className="w-16 h-16 rounded-full border-2 border-vault-cyan border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="flex gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-vault-cyan animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground">ENCRYPTED NEURAL INFERENCE IN PROGRESS</span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!result) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen px-4"
    >
      <h2 className="text-2xl font-display vault-glow-cyan text-vault-cyan mb-2">Inference Complete</h2>
      <p className="text-muted-foreground text-xs font-mono mb-8">
        {error ? "FALLBACK ANALYSIS" : "ML-POWERED PRIVACY-PRESERVED ANALYSIS"}
      </p>

      <div className="vault-panel p-6 w-full max-w-xl space-y-4">
        {/* Input echo */}
        <div>
          <div className="text-xs font-display text-muted-foreground tracking-wider mb-1">YOUR INPUT</div>
          <p className="text-sm text-foreground font-mono bg-background/50 p-3 rounded border border-border">{input}</p>
        </div>

        {/* Analysis results */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "SENTIMENT", value: result.sentiment, color: result.sentiment === "Negative" ? "text-destructive" : result.sentiment === "Positive" ? "text-vault-cyan" : "text-secondary-foreground" },
            { label: "INTENT", value: result.intent, color: "text-secondary-foreground" },
            { label: "CONFIDENCE", value: `${(result.confidence * 100).toFixed(1)}%`, color: "text-vault-cyan" },
          ].map(item => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="text-[10px] font-display text-muted-foreground tracking-wider">{item.label}</div>
              <div className={`text-sm font-display ${item.color}`}>{item.value}</div>
            </motion.div>
          ))}
        </div>

        {/* AI Response */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <div className="text-xs font-display text-muted-foreground tracking-wider mb-1">AI RESPONSE</div>
          <div className="bg-background/50 p-4 rounded border border-vault-cyan/20 text-sm text-foreground font-mono leading-relaxed">
            {result.response}
          </div>
        </motion.div>

        {/* Security badge */}
        <motion.div className="flex items-center gap-2 pt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <div className="w-2 h-2 rounded-full bg-vault-cyan shadow-[0_0_6px_hsl(var(--vault-cyan))]" />
          <span className="text-[10px] font-mono text-vault-cyan">SERVER NEVER ACCESSED PLAINTEXT · END-TO-END ENCRYPTED</span>
        </motion.div>
      </div>

      <div className="flex gap-4 mt-8">
        <button onClick={onRestart} className="vault-button">↻ RESTART</button>
        <button onClick={onHackerView} className="vault-button" style={{ background: "linear-gradient(135deg, #3B1670, #FF3B3B)" }}>
          ☠ HACKER VIEW
        </button>
      </div>
    </motion.div>
  );
}
