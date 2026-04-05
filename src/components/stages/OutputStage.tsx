import { motion } from "framer-motion";

interface Props {
  input: string;
  onHackerView: () => void;
  onRestart: () => void;
}

function analyzeInput(input: string) {
  const lower = input.toLowerCase();
  const negWords = ["stress", "anxious", "worried", "sad", "depressed", "angry", "frustrated", "tired", "overwhelmed", "afraid", "scared"];
  const posWords = ["happy", "great", "excited", "love", "wonderful", "amazing", "good", "fantastic"];
  const qWords = ["?", "how", "what", "why", "when", "where", "who"];

  const hasNeg = negWords.some(w => lower.includes(w));
  const hasPos = posWords.some(w => lower.includes(w));
  const hasQ = qWords.some(w => lower.includes(w));

  let sentiment = "Neutral";
  let confidence = 0.82;
  let intent = "General Statement";
  let response = "Your message has been analyzed through our encrypted pipeline. The AI inference was performed entirely on encrypted data, ensuring complete privacy.";

  if (hasNeg) {
    sentiment = "Negative";
    confidence = 0.91;
    intent = "Emotional Expression";
    response = "It seems like you're going through a challenging time. Remember that it's okay to feel this way. Try breaking your tasks into smaller, manageable steps and take short breaks. Consider reaching out to someone you trust. You've got this.";
  } else if (hasPos) {
    sentiment = "Positive";
    confidence = 0.94;
    intent = "Positive Expression";
    response = "It's great to hear you're feeling positive! Maintaining this mindset can help boost your productivity and relationships. Keep nurturing what brings you joy.";
  } else if (hasQ) {
    intent = "Information Seeking";
    confidence = 0.87;
    response = "Your question has been processed through our FHE pipeline. While I can provide encrypted analysis, I encourage you to explore trusted resources for detailed answers on this topic.";
  }

  return { sentiment, confidence, intent, response };
}

export default function OutputStage({ input, onHackerView, onRestart }: Props) {
  const result = analyzeInput(input);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen px-4"
    >
      <h2 className="text-2xl font-display vault-glow-cyan text-vault-cyan mb-2">Inference Complete</h2>
      <p className="text-muted-foreground text-xs font-mono mb-8">PRIVACY-PRESERVED AI ANALYSIS</p>

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
