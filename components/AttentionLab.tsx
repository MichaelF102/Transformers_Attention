import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Search, Key, Database, ArrowRight } from 'lucide-react';
import { cn, dotProduct, softmax } from '../utils';

const AttentionLab: React.FC = () => {
  // Simplified dimensions for visualization (3 dimensions)
  const [query, setQuery] = useState<number[]>([0.8, 0.2, 0.5]);
  
  // Hardcoded simple database of "Keys" and "Values"
  // Keys represent semantic features, Values represent the actual content info
  const memory = useMemo(() => [
    { id: 1, key: [0.9, 0.1, 0.1], value: [1, 0, 0], label: "Word A" }, // High match for 1st dim
    { id: 2, key: [0.1, 0.9, 0.2], value: [0, 1, 0], label: "Word B" }, // High match for 2nd dim
    { id: 3, key: [0.5, 0.5, 0.8], value: [0, 0, 1], label: "Word C" }, // Match for mix
  ], []);

  // 1. Calculate Dot Products (Scores)
  const scores = memory.map(m => dotProduct(query, m.key));
  
  // 2. Apply Scaling (sqrt(dk) - let's assume dk=3 for vis) -> roughly divide by 1.73
  const scaledScores = scores.map(s => s / Math.sqrt(3));

  // 3. Softmax
  const weights = softmax(scaledScores);

  // 4. Weighted Sum (Output)
  const output = [0, 0, 0].map((_, i) => 
    weights.reduce((sum, weight, idx) => sum + weight * memory[idx].value[i], 0)
  );

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Search className="w-6 h-6 text-rose-500" />
          Scaled Dot-Product Attention
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
            The core mechanism: <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-rose-500 font-mono text-sm">Attention(Q, K, V) = softmax(QK^T / √dk)V</code>.
            Adjust the Query vector to see how the model "attends" to different Keys to retrieve Values.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* QUERY INPUT */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-800/30">
            <h4 className="font-semibold text-rose-700 dark:text-rose-300 mb-4 flex items-center gap-2">
              <Search className="w-4 h-4" /> Query (Q)
            </h4>
            <div className="space-y-4">
              {query.map((val, i) => (
                <div key={i}>
                  <label className="text-xs font-mono text-rose-600/70 mb-1 block">Dim {i+1}</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    value={val} 
                    onChange={(e) => {
                      const newQ = [...query];
                      newQ[i] = parseFloat(e.target.value);
                      setQuery(newQ);
                    }}
                    className="w-full h-2 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                  <div className="text-right text-xs font-mono mt-1">{val.toFixed(1)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MECHANISM VISUALIZATION */}
        <div className="lg:col-span-6 flex flex-col justify-center relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 -z-10 transform -translate-y-1/2" />
            
            <div className="space-y-4">
                {memory.map((item, idx) => (
                    <motion.div 
                        layout
                        key={item.id} 
                        className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                        {/* KEY */}
                        <div className="w-24 shrink-0 text-center">
                            <div className="text-xs text-slate-400 uppercase font-bold mb-1">Key</div>
                            <div className="flex gap-1 justify-center">
                                {item.key.map((k, ki) => (
                                    <div key={ki} className="w-3 h-8 bg-indigo-400 rounded-sm" style={{ opacity: k }} />
                                ))}
                            </div>
                        </div>

                        {/* DOT PRODUCT */}
                        <div className="flex-1 flex flex-col items-center px-2">
                            <div className="text-[10px] text-slate-400 mb-1">Similarity</div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-indigo-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.max(0, Math.min(100, scores[idx] * 100))}%` }}
                                />
                            </div>
                            <span className="text-xs font-mono mt-1">{scores[idx].toFixed(2)}</span>
                        </div>

                        {/* WEIGHT (Softmax) */}
                        <div className="w-24 shrink-0 text-center">
                            <div className="text-[10px] text-rose-500 font-bold mb-1">Attention Weight</div>
                            <div 
                                className="mx-auto w-12 h-12 rounded-full border-4 border-rose-500 flex items-center justify-center bg-rose-50 dark:bg-rose-900/20 transition-all duration-300"
                                style={{ opacity: 0.2 + weights[idx], transform: `scale(${0.8 + weights[idx]})` }}
                            >
                                <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                                    {(weights[idx] * 100).toFixed(0)}%
                                </span>
                            </div>
                        </div>

                        {/* VALUE */}
                        <div className="w-24 shrink-0 opacity-50" style={{ opacity: 0.3 + weights[idx] }}>
                            <div className="text-xs text-emerald-500 uppercase font-bold mb-1 text-center">Value</div>
                             <div className="flex gap-1 justify-center">
                                {item.value.map((v, vi) => (
                                    <div key={vi} className="w-3 h-8 bg-emerald-500 rounded-sm" style={{ opacity: v }} />
                                ))}
                            </div>
                            <div className="text-center text-xs mt-1 text-slate-500">{item.label}</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* OUTPUT RESULT */}
        <div className="lg:col-span-3 flex flex-col justify-center">
             <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30 h-full flex flex-col justify-center items-center text-center">
                <Database className="w-8 h-8 text-emerald-500 mb-2" />
                <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-4">Context Vector (Output)</h4>
                
                <div className="flex gap-2 mb-4">
                     {output.map((val, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <motion.div 
                                className="w-8 bg-emerald-500 rounded shadow-sm"
                                animate={{ height: Math.max(4, val * 80) }}
                            />
                            <span className="text-xs font-mono text-slate-500">{val.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-slate-500 px-2">
                    A weighted sum of Values. Notice how the output resembles the Value of the Key that best matches the Query.
                </p>
             </div>
        </div>
      </div>
    </div>
  );
};

export default AttentionLab;
