
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';
import { cn } from '../utils';

// --- Data for the Diagram Parts ---

interface PartInfo {
  title: string;
  desc: string;
}

const PARTS: Record<string, PartInfo> = {
  'inputs': { title: 'Inputs', desc: 'The source sequence (e.g., English sentence) to be translated or processed.' },
  'input-embedding': { title: 'Input Embedding', desc: 'Converts tokens into dense vectors of dimension d_model (512).' },
  'pos-enc-input': { title: 'Positional Encoding', desc: 'Adds timing/order information to the input embeddings using sine/cosine waves.' },
  'encoder-stack': { title: 'Encoder Stack (Nx)', desc: 'A stack of N=6 identical layers. Each layer has two sub-layers: Multi-Head Attention and a Feed Forward Network.' },
  'multi-head-attn': { title: 'Multi-Head Attention', desc: 'Allows the model to jointly attend to information from different representation subspaces at different positions.' },
  'add-norm': { title: 'Add & Norm', desc: 'Residual connection followed by Layer Normalization. Crucial for training deep networks.' },
  'feed-forward': { title: 'Feed Forward', desc: 'A position-wise fully connected feed-forward network. Applied to each position separately and identically.' },
  
  'outputs': { title: 'Outputs (Shifted)', desc: 'The target sequence shifted right (e.g., start token + previous words) so the model predicts the next word.' },
  'output-embedding': { title: 'Output Embedding', desc: 'Converts target tokens into vectors.' },
  'pos-enc-output': { title: 'Positional Encoding', desc: 'Adds order information to the target embeddings.' },
  'decoder-stack': { title: 'Decoder Stack (Nx)', desc: 'Stack of N=6 layers. Has an extra sub-layer to attend to the Encoder\'s output.' },
  'masked-attn': { title: 'Masked Multi-Head Attention', desc: 'Prevents positions from attending to subsequent positions (cheating). Ensures predictions depend only on known outputs.' },
  'cross-attn': { title: 'Cross Attention', desc: 'Multi-Head Attention where queries come from the decoder, and keys/values come from the encoder output.' },
  
  'linear': { title: 'Linear', desc: 'Projects the vector produced by the stack into a much larger vector (vocabulary size).' },
  'softmax': { title: 'Softmax', desc: 'Converts the linear output into probabilities for each word in the vocabulary.' },
  'probs': { title: 'Output Probabilities', desc: 'The final probability distribution for the next token.' },
};

const ArchitectureDiagram: React.FC = () => {
  const [activePart, setActivePart] = useState<string | null>(null);

  const handleClick = (id: string) => {
    setActivePart(activePart === id ? null : id);
  };

  // Helper for SVG Blocks
  const Block = ({ x, y, w, h, text, color, id }: { x: number, y: number, w: number, h: number, text: string, color: string, id: string }) => (
    <motion.g 
      whileHover={{ scale: 1.02 }}
      onClick={() => handleClick(id)}
      className="cursor-pointer"
    >
      <rect 
        x={x} y={y} width={w} height={h} rx="8" 
        fill={activePart === id ? '#fcd34d' : color} 
        stroke="currentColor" strokeWidth="2"
        className={cn("transition-colors duration-300", activePart === id ? "stroke-amber-600 shadow-lg" : "stroke-slate-800 dark:stroke-slate-300")}
      />
      <foreignObject x={x} y={y} width={w} height={h}>
        <div className="h-full w-full flex items-center justify-center text-center p-1">
          <span className="text-sm font-bold text-slate-900 pointer-events-none select-none leading-tight">{text}</span>
        </div>
      </foreignObject>
    </motion.g>
  );

  // Helper for Add & Norm (Yellow)
  const AddNorm = ({ x, y, w, h, id }: { x: number, y: number, w: number, h: number, id: string }) => (
    <Block x={x} y={y} w={w} h={h} text="Add & Norm" color="#fef08a" id={id} />
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* DIAGRAM SVG AREA */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden relative select-none">
        <div className="absolute top-4 left-4 z-10">
           <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-500 uppercase tracking-wider border border-slate-200 dark:border-slate-700">
             Figure 1
           </div>
        </div>
        <div className="flex justify-center">
            {/* SVG ViewBox adjusted for the classic 2-column layout */}
            <svg viewBox="0 0 600 850" className="w-full max-w-[600px] h-auto text-slate-800 dark:text-slate-200 overflow-visible">
              
              {/* --- ENCODER COLUMN (Left) --- */}
              <g transform="translate(50, 0)">
                 {/* Box surrounding Nx Stack */}
                 <rect x="-10" y="220" width="220" height="340" rx="12" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="8 4" />
                 <text x="-30" y="400" className="text-xl font-bold fill-slate-400">Nx</text>

                 {/* Input Flow */}
                 <text x="100" y="780" textAnchor="middle" className="font-bold text-lg fill-current">Inputs</text>
                 <Block x={20} y={700} w={160} h={40} text="Input Embedding" color="#fecaca" id="input-embedding" /> {/* Pink */}
                 
                 {/* Positional Encoding Circle */}
                 <circle cx="100" cy="660" r="20" fill="white" stroke="currentColor" strokeWidth="2" />
                 <path d="M 90 660 Q 100 645 110 660 T 130 660" stroke="currentColor" strokeWidth="2" fill="none" transform="translate(-10,0) scale(0.8)" />
                 <text x="130" y="665" className="text-xs fill-slate-500">Positional Encoding</text>
                 
                 {/* Arrows Up */}
                 <line x1="100" y1="760" x2="100" y2="740" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)" />
                 <line x1="100" y1="700" x2="100" y2="680" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)" />
                 <line x1="100" y1="640" x2="100" y2="620" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)" />

                 {/* -- Encoder Layer -- */}
                 {/* Multi-Head Attn */}
                 <Block x={20} y={520} w={160} h={50} text="Multi-Head Attention" color="#fed7aa" id="multi-head-attn" /> {/* Orange */}
                 {/* Add & Norm */}
                 <AddNorm x={20} y={470} w={160} h={30} id="add-norm" />
                 
                 {/* Feed Forward */}
                 <Block x={20} y={370} w={160} h={50} text="Feed Forward" color="#bae6fd" id="feed-forward" /> {/* Blue */}
                 {/* Add & Norm */}
                 <AddNorm x={20} y={320} w={160} h={30} id="add-norm" />

                 {/* Arrows Internal */}
                 <line x1="100" y1="620" x2="100" y2="570" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)" />
                 <line x1="100" y1="500" x2="100" y2="470" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)" />
                 <line x1="100" y1="420" x2="100" y2="470" stroke="currentColor" strokeWidth="2" /> {/* Residual loop mock */}
                 <path d="M 100 570 L 100 580" stroke="currentColor" strokeWidth="2" />

                 {/* Connect to Feed Forward */}
                 <line x1="100" y1="470" x2="100" y2="420" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)" />
                 <line x1="100" y1="370" x2="100" y2="350" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)" />

                 {/* Output of Encoder */}
                 <line x1="100" y1="320" x2="100" y2="200" stroke="currentColor" strokeWidth="2" />
                 
                 {/* CROSS ATTENTION CONNECTION (The Big Arrow) */}
                 <path d="M 100 200 L 100 180 L 350 180 L 350 380" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                 <path d="M 350 380 L 340 380 L 380 380" fill="none" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)" />
              </g>

              {/* --- DECODER COLUMN (Right) --- */}
              <g transform="translate(350, 0)">
                 {/* Box surrounding Nx Stack */}
                 <rect x="-10" y="220" width="220" height="480" rx="12" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="8 4" />
                 <text x="225" y="400" className="text-xl font-bold fill-slate-400">Nx</text>

                 {/* Output Flow */}
                 <text x="100" y="820" textAnchor="middle" className="font-bold text-lg fill-current">Outputs</text>
                 <text x="100" y="840" textAnchor="middle" className="text-xs fill-slate-500">(shifted right)</text>
                 
                 <Block x={20} y={740} w={160} h={40} text="Output Embedding" color="#fecaca" id="output-embedding" />
                 
                 {/* Positional Encoding */}
                 <circle cx="100" cy={700} r="20" fill="white" stroke="currentColor" strokeWidth="2" />
                 <path d="M 90 700 Q 100 685 110 700 T 130 700" stroke="currentColor" strokeWidth="2" fill="none" transform="translate(-10,0) scale(0.8)" />

                 {/* Arrows Up */}
                 <line x1="100" y1="800" x2="100" y2="780" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)" />
                 <line x1="100" y1="740" x2="100" y2="720" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)" />

                 {/* -- Decoder Layer -- */}
                 {/* Masked Attn */}
                 <Block x={20} y={620} w={160} h={50} text="Masked Multi-Head Attention" color="#fed7aa" id="masked-attn" />
                 <AddNorm x={20} y={570} w={160} h={30} id="add-norm" />

                 {/* Cross Attn */}
                 <Block x={20} y={480} w={160} h={50} text="Multi-Head Attention" color="#fed7aa" id="cross-attn" />
                 <AddNorm x={20} y={430} w={160} h={30} id="add-norm" />

                 {/* Feed Forward */}
                 <Block x={20} y={340} w={160} h={50} text="Feed Forward" color="#bae6fd" id="feed-forward" />
                 <AddNorm x={20} y={290} w={160} h={30} id="add-norm" />

                 {/* Connections */}
                 <line x1="100" y1="680" x2="100" y2="670" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)" />
                 <line x1="100" y1="570" x2="100" y2="530" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)" />
                 <line x1="100" y1="430" x2="100" y2="390" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)" />
                 <line x1="100" y1="290" x2="100" y2="200" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)" />

                 {/* Top Head */}
                 <Block x={30} y={150} w={140} h={30} text="Linear" color="#c7d2fe" id="linear" /> {/* Indigo */}
                 <Block x={30} y={100} w={140} h={30} text="Softmax" color="#a7f3d0" id="softmax" /> {/* Emerald */}
                 
                 <text x="100" y="50" textAnchor="middle" className="font-bold text-lg fill-current">Output Probabilities</text>
                 <line x1="100" y1="100" x2="100" y2="70" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)" />
              </g>

              {/* Defs for markers */}
              <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="currentColor" />
                </marker>
              </defs>
            </svg>
        </div>
      </div>

      {/* DESCRIPTION PANEL */}
      <div className="lg:col-span-1 h-full">
        <div className="sticky top-24">
            <AnimatePresence mode="wait">
                {activePart ? (
                    <motion.div
                        key={activePart}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg border-l-4 border-amber-400 dark:border-amber-500"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{PARTS[activePart]?.title}</h3>
                            <button onClick={() => setActivePart(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                            {PARTS[activePart]?.desc}
                        </p>
                        <div className="text-sm text-slate-400 italic">
                            Click another block to explore.
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 text-center flex flex-col items-center justify-center min-h-[300px]"
                    >
                        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 text-slate-400">
                            <Info className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">Interactive Diagram</h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            Click on any component in the diagram to understand its specific role in the architecture.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
