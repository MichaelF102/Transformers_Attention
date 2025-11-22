
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, RefreshCw, ArrowRight, Cpu } from 'lucide-react';
import { cn } from '../utils';

const ProcessingSimulator: React.FC = () => {
  const [inputText, setInputText] = useState("Attention is all you need");
  const [tokens, setTokens] = useState<string[]>([]);
  const [processingStep, setProcessingStep] = useState(0); // 0: Idle, 1: Tokenize, 2: Embed, 3: Attend, 4: Probabilities
  
  useEffect(() => {
    // Reset when text changes significantly or just allow manual play
    setProcessingStep(0);
  }, [inputText]);

  const handleSimulate = () => {
    if (!inputText.trim()) return;
    setProcessingStep(1); // Tokenize
    
    // Mock simple tokenization (split by space)
    const newTokens = inputText.trim().split(/\s+/);
    setTokens(newTokens);

    // Sequence the animation
    setTimeout(() => setProcessingStep(2), 800); // Embed
    setTimeout(() => setProcessingStep(3), 1800); // Attend
    setTimeout(() => setProcessingStep(4), 3500); // Output
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
      {/* HEADER / INPUT */}
      <div className="p-6 bg-slate-950 border-b border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
                <Cpu className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold">Transformer Process</h3>
         </div>
         
         <div className="flex-1 w-full max-w-xl flex gap-2">
            <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-200 placeholder-slate-600"
                placeholder="Enter text to process..."
            />
            <button 
                onClick={handleSimulate}
                disabled={processingStep > 0 && processingStep < 4}
                className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
                {processingStep > 0 && processingStep < 4 ? (
                    <RefreshCw className="w-4 h-4 animate-spin" /> 
                ) : (
                    <Play className="w-4 h-4" />
                )}
                {processingStep === 4 ? "Re-run" : "Process"}
            </button>
         </div>
      </div>

      {/* VISUALIZATION STAGE */}
      <div className="p-8 min-h-[400px] flex flex-col gap-12 relative">
         
         {/* STEP 1: TOKENS */}
         <div className="relative min-h-[60px]">
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-bold text-slate-600 uppercase tracking-widest w-20 text-center">Tokenize</div>
            <div className="flex flex-wrap gap-2 pl-8">
                {processingStep >= 1 && tokens.map((token, i) => (
                    <motion.div
                        key={`tok-${i}`}
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-sm font-mono text-indigo-300 shadow-sm"
                    >
                        {token}
                    </motion.div>
                ))}
            </div>
         </div>

         {/* CONNECTOR */}
         {processingStep >= 2 && (
             <motion.div 
                initial={{ height: 0, opacity: 0 }} animate={{ height: 40, opacity: 1 }} 
                className="border-l-2 border-dashed border-slate-700 ml-12 absolute top-[80px]" 
             />
         )}

         {/* STEP 2: EMBEDDINGS */}
         <div className="relative min-h-[80px]">
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-bold text-slate-600 uppercase tracking-widest w-20 text-center">Embedding</div>
            <div className="flex flex-wrap gap-2 pl-8">
                {processingStep >= 2 && tokens.map((_, i) => (
                    <motion.div
                        key={`emb-${i}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 48 }}
                        transition={{ delay: i * 0.1 }}
                        className="w-12 bg-gradient-to-b from-pink-500 to-rose-600 rounded-md border border-pink-400/30 shadow-lg relative group cursor-help"
                    >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/50 flex items-center justify-center text-[10px] transition-opacity rounded-md">
                            512d
                        </div>
                    </motion.div>
                ))}
            </div>
         </div>

         {/* CONNECTOR */}
         {processingStep >= 3 && (
             <motion.div 
                initial={{ height: 0, opacity: 0 }} animate={{ height: 40, opacity: 1 }} 
                className="border-l-2 border-dashed border-slate-700 ml-12 absolute top-[190px]" 
             />
         )}

         {/* STEP 3: SELF-ATTENTION (Heatmap) */}
         <div className="relative">
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-bold text-slate-600 uppercase tracking-widest w-20 text-center">Attention</div>
            <div className="pl-8">
                {processingStep >= 3 ? (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="bg-slate-800 p-4 rounded-xl border border-slate-700 inline-block"
                    >
                        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${tokens.length}, minmax(0, 1fr))` }}>
                            {tokens.map((tRow, r) => (
                                tokens.map((tCol, c) => {
                                    // Mock "Attention" - higher if diagonal or random "semantic" match
                                    const isDiagonal = r === c;
                                    const intensity = isDiagonal ? 0.8 : Math.max(0.1, Math.random() * 0.5);
                                    return (
                                        <motion.div
                                            key={`${r}-${c}`}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: (r+c) * 0.05 }}
                                            className="w-8 h-8 rounded bg-amber-500 relative hover:ring-2 ring-white z-10"
                                            style={{ opacity: intensity }}
                                            title={`${tRow} attends to ${tCol}: ${(intensity*100).toFixed(0)}%`}
                                        />
                                    );
                                })
                            ))}
                        </div>
                        <div className="mt-2 text-center text-xs text-slate-500">Attention Matrix (Heatmap)</div>
                    </motion.div>
                ) : (
                    <div className="h-32 flex items-center text-slate-600 text-sm italic pl-4">Waiting for input...</div>
                )}
            </div>
         </div>

         {/* STEP 4: PREDICTION */}
         {processingStep >= 4 && (
             <motion.div 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="absolute right-8 top-1/2 -translate-y-1/2 bg-emerald-900/30 p-6 rounded-2xl border border-emerald-500/30 backdrop-blur-sm"
             >
                 <div className="text-xs font-bold text-emerald-500 uppercase mb-2">Next Token Prediction</div>
                 <div className="text-3xl font-bold text-white mb-1">"models"</div>
                 <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[85%]" />
                 </div>
                 <div className="text-right text-xs text-emerald-400 mt-1">85% Probability</div>
             </motion.div>
         )}
      </div>
    </div>
  );
};

export default ProcessingSimulator;
