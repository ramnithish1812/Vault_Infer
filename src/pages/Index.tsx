import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import Background3D from "@/components/Background3D";
import BinaryRain from "@/components/BinaryRain";
import StageIndicator from "@/components/StageIndicator";
import InputStage from "@/components/stages/InputStage";
import EmbeddingStage from "@/components/stages/EmbeddingStage";
import EncryptionStage from "@/components/stages/EncryptionStage";
import TransmissionStage from "@/components/stages/TransmissionStage";
import ProcessingStage from "@/components/stages/ProcessingStage";
import DecryptionStage from "@/components/stages/DecryptionStage";
import OutputStage from "@/components/stages/OutputStage";
import HackerStage from "@/components/stages/HackerStage";

const Index = () => {
  const [stage, setStage] = useState(0);
  const [inputText, setInputText] = useState("");

  const handleInput = useCallback((text: string) => {
    setInputText(text);
    setStage(1);
  }, []);

  const next = useCallback(() => setStage(s => s + 1), []);
  const restart = useCallback(() => { setStage(0); setInputText(""); }, []);

  return (
    <div className="relative min-h-screen">
      <Background3D />
      <BinaryRain />
      <StageIndicator currentStage={stage} />

      <div className="relative z-10 pt-12">
        <AnimatePresence mode="wait">
          {stage === 0 && <InputStage key="input" onSubmit={handleInput} />}
          {stage === 1 && <EmbeddingStage key="embed" onComplete={next} />}
          {stage === 2 && <EncryptionStage key="encrypt" onComplete={next} />}
          {stage === 3 && <TransmissionStage key="transmit" onComplete={next} />}
          {stage === 4 && <ProcessingStage key="process" onComplete={next} />}
          {stage === 5 && <DecryptionStage key="decrypt" onComplete={next} />}
          {stage === 6 && <OutputStage key="output" input={inputText} onHackerView={() => setStage(7)} onRestart={restart} />}
          {stage === 7 && <HackerStage key="hacker" onBack={() => setStage(6)} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
