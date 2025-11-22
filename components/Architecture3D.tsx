
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, X, ArrowRight, Info, Maximize2, Minimize2, Zap, Box } from 'lucide-react';
import { cn } from '../utils';

// --- Types & Data ---

type ComponentId = 
  | 'inputs' | 'input-embedding' | 'positional-encoding'
  | 'encoder-stack' | 'encoder-self-attn' | 'encoder-add-norm-1' | 'encoder-ffn' | 'encoder-add-norm-2'
  | 'outputs' | 'output-embedding' | 'output-encoding'
  | 'decoder-stack' | 'decoder-masked-attn' | 'decoder-add-norm-1' | 'decoder-cross-attn' | 'decoder-add-norm-2' | 'decoder-ffn' | 'decoder-add-norm-3'
  | 'linear' | 'softmax' | 'output-probs';

interface ArchitectureComponent {
  id: ComponentId;
  label: string;
  description: string;
  detailedText: string;
  color: string; // Tailwind class
  group: 'encoder' | 'decoder' | 'shared';
  height?: number; // For 3D visuals
}

const ARCHITECTURE_DATA: Record<string, ArchitectureComponent> = {
  // Encoder Side
  'inputs': {
    id: 'inputs', label: 'Inputs', group: 'encoder', color: 'bg-slate-200 dark:bg-slate-700',
    description: 'Raw sequence of tokens (e.g., "Hello world")',
    detailedText: 'The input sequence is tokenized into integers. These tokens are the raw material that the model will process.'
  },
  'input-embedding': {
    id: 'input-embedding', label: 'Input Embedding', group: 'encoder', color: 'bg-blue-200 dark:bg-blue-900/50',
    description: 'Converts tokens to vectors (d_model = 512)',
    detailedText: 'Learned linear transformation that maps discrete tokens to continuous vector space. Vectors of dimension 512 capture semantic meaning.'
  },
  'positional-encoding': {
    id: 'positional-encoding', label: 'Positional Encoding', group: 'encoder', color: 'bg-yellow-200 dark:bg-yellow-900/50',
    description: 'Injects order information',
    detailedText: 'Since the model has no recurrence, sine and cosine waves of different frequencies are added to embeddings to give the model a sense of token order.'
  },
  'encoder-stack': {
    id: 'encoder-stack', label: 'Encoder Layers (Nx6)', group: 'encoder', color: 'bg-blue-500 dark:bg-blue-600',
    description: 'Stack of 6 identical layers',
    detailedText: 'The core processing unit. Consists of 6 stacked layers, each containing a Multi-Head Self-Attention mechanism and a Feed-Forward Network.'
  },
  // Detailed Encoder Parts
  'encoder-self-attn': {
    id: 'encoder-self-attn', label: 'Multi-Head Attention', group: 'encoder', color: 'bg-orange-400 dark:bg-orange-600',
    description: 'Self-Attention Mechanism',
    detailedText: 'Allows each position to attend to all positions in the previous layer. "Multi-head" means it runs h=8 attention mechanisms in parallel to capture different types of relationships.'
  },
  'encoder-add-norm-1': {
    id: 'encoder-add-norm-1', label: 'Add & Norm', group: 'encoder', color: 'bg-yellow-400 dark:bg-yellow-600',
    description: 'Residual connection + LayerNorm',
    detailedText: 'Output = LayerNorm(x + Sublayer(x)). Facilitates training deep networks by allowing gradients to flow through the network more easily.'
  },
  'encoder-ffn': {
    id: 'encoder-ffn', label: 'Feed Forward', group: 'encoder', color: 'bg-sky-400 dark:bg-sky-600',
    description: 'Position-wise FFN',
    detailedText: 'Two linear transformations with a ReLU activation in between, applied to each position separately and identically. FFN(x) = max(0, xW1 + b1)W2 + b2.'
  },
  'encoder-add-norm-2': {
    id: 'encoder-add-norm-2', label: 'Add & Norm', group: 'encoder', color: 'bg-yellow-400 dark:bg-yellow-600',
    description: 'Residual connection + LayerNorm',
    detailedText: 'Stabilizes the hidden state before passing it to the next encoder layer.'
  },

  // Decoder Side
  'outputs': {
    id: 'outputs', label: 'Outputs (Shifted)', group: 'decoder', color: 'bg-slate-200 dark:bg-slate-700',
    description: 'Previous outputs for auto-regression',
    detailedText: 'During training, the model sees the target sequence shifted right by one position. During inference, it sees the tokens generated so far.'
  },
  'output-embedding': {
    id: 'output-embedding', label: 'Output Embedding', group: 'decoder', color: 'bg-pink-200 dark:bg-pink-900/50',
    description: 'Converts tokens to vectors',
    detailedText: 'Similar to input embeddings, converting target tokens into d_model vectors.'
  },
  'output-encoding': {
    id: 'output-encoding', label: 'Positional Encoding', group: 'decoder', color: 'bg-yellow-200 dark:bg-yellow-900/50',
    description: 'Injects order information',
    detailedText: 'Adds positional information to the target embeddings.'
  },
  'decoder-stack': {
    id: 'decoder-stack', label: 'Decoder Layers (Nx6)', group: 'decoder', color: 'bg-pink-500 dark:bg-pink-600',
    description: 'Stack of 6 identical layers',
    detailedText: 'Generates the output sequence. Contains Masked Self-Attention, Cross-Attention (attending to Encoder output), and FFN.'
  },
  // Detailed Decoder Parts
  'decoder-masked-attn': {
    id: 'decoder-masked-attn', label: 'Masked Attention', group: 'decoder', color: 'bg-orange-400 dark:bg-orange-600',
    description: 'Ensures causal prediction',
    detailedText: 'Prevents positions from attending to subsequent positions. This ensures that the prediction for position i can depend only on the known outputs at positions less than i.'
  },
  'decoder-add-norm-1': {
    id: 'decoder-add-norm-1', label: 'Add & Norm', group: 'decoder', color: 'bg-yellow-400 dark:bg-yellow-600',
    description: 'Residual + Norm',
    detailedText: 'Standard residual connection and normalization after masked attention.'
  },
  'decoder-cross-attn': {
    id: 'decoder-cross-attn', label: 'Cross Attention', group: 'decoder', color: 'bg-orange-500 dark:bg-orange-700',
    description: 'Attends to Encoder Output',
    detailedText: 'Multi-Head Attention where queries come from the previous decoder layer, and keys/values come from the output of the Encoder. This aligns the input and output sequences.'
  },
  'decoder-add-norm-2': {
    id: 'decoder-add-norm-2', label: 'Add & Norm', group: 'decoder', color: 'bg-yellow-400 dark:bg-yellow-600',
    description: 'Residual + Norm',
    detailedText: 'Normalization after integrating encoder information.'
  },
  'decoder-ffn': {
    id: 'decoder-ffn', label: 'Feed Forward', group: 'decoder', color: 'bg-sky-400 dark:bg-sky-600',
    description: 'Position-wise FFN',
    detailedText: 'Point-wise feed forward network, same structure as in the encoder.'
  },
  'decoder-add-norm-3': {
    id: 'decoder-add-norm-3', label: 'Add & Norm', group: 'decoder', color: 'bg-yellow-400 dark:bg-yellow-600',
    description: 'Residual + Norm',
    detailedText: 'Final normalization for the decoder block.'
  },
  'linear': {
    id: 'linear', label: 'Linear', group: 'decoder', color: 'bg-indigo-500 dark:bg-indigo-600',
    description: 'Projection to vocab size',
    detailedText: 'A learned linear transformation that projects the vector of dimension d_model to a vector of logits the size of the vocabulary.'
  },
  'softmax': {
    id: 'softmax', label: 'Softmax', group: 'decoder', color: 'bg-emerald-500 dark:bg-emerald-600',
    description: 'Converts to probabilities',
    detailedText: 'Converts the logits into probabilities. The token with the highest probability is chosen as the next token in the sequence.'
  },
  'output-probs': {
    id: 'output-probs', label: 'Output Probabilities', group: 'decoder', color: 'bg-emerald-200 dark:bg-emerald-900/50',
    description: 'Final prediction',
    detailedText: 'The final distribution over the vocabulary for the next token.'
  }
};

// --- 3D Isometric Block Component ---

interface Block3DProps {
  data: ArchitectureComponent;
  isSelected: boolean;
  onClick: () => void;
  xOffset?: number;
  yOffset?: number;
  zOffset?: number;
  delay?: number;
  isHoverDisabled?: boolean;
}

const Block3D: React.FC<Block3DProps> = ({ data, isSelected, onClick, xOffset = 0, yOffset = 0, zOffset = 0, delay = 0, isHoverDisabled }) => {
  const [hover, setHover] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset + 100 }}
      animate={{ 
        opacity: 1, 
        x: xOffset,
        y: hover && !isHoverDisabled ? yOffset - 10 : yOffset,
        z: zOffset,
      }}
      transition={{ delay: delay * 0.05, type: "spring", stiffness: 120, damping: 20 }}
      className="absolute transform-style-3d cursor-pointer group"
      style={{
        transform: `translateX(${xOffset}px) translateY(${yOffset}px) translateZ(${zOffset}px)`,
        zIndex: 1000 - yOffset // Simple depth sorting
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {/* 3D Box Construction */}
      <div className={cn(
        "relative w-40 h-12 transition-transform duration-300 transform-style-3d",
        isSelected ? "scale-110" : ""
      )}>
        {/* Front Face */}
        <div className={cn(
          "absolute inset-0 border border-white/20 flex items-center justify-center shadow-lg backdrop-blur-md transition-colors duration-300",
          data.color,
          isSelected ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900" : "opacity-90 group-hover:opacity-100"
        )}>
          <span className="text-xs font-bold text-slate-800 dark:text-white drop-shadow-md text-center px-2 pointer-events-none select-none">
            {data.label}
          </span>
        </div>
        
        {/* Top Face (gives depth) */}
        <div className={cn(
          "absolute w-full h-full origin-bottom transform -rotate-x-90 -translate-y-full brightness-125 opacity-80",
          data.color
        )} />
        
        {/* Side Face (gives depth) */}
        <div className={cn(
          "absolute w-12 h-full origin-left transform -rotate-y-90 translate-x-0 brightness-75 opacity-80",
          data.color
        )} />
      </div>
      
      {/* Connecting Line/Connector node (visual flourish) */}
      <div className="absolute left-1/2 top-full w-0.5 h-4 bg-slate-300 dark:bg-slate-600 opacity-50 -translate-x-1/2" />
    </motion.div>
  );
};

// --- Main Architecture Component ---

const Architecture3D: React.FC = () => {
  // Default to detailed mode now since it's the secondary visualization
  const [detailedMode, setDetailedMode] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Construct the stacks based on mode
  const getEncoderItems = () => {
    const base = ['inputs', 'input-embedding', 'positional-encoding'];
    const stack = detailedMode 
      ? ['encoder-add-norm-2', 'encoder-ffn', 'encoder-add-norm-1', 'encoder-self-attn'] 
      : ['encoder-stack'];
    return [...base, ...stack].reverse(); // Top to bottom visual order
  };

  const getDecoderItems = () => {
    const base = ['outputs', 'output-embedding', 'output-encoding'];
    const stack = detailedMode
      ? ['decoder-add-norm-3', 'decoder-ffn', 'decoder-add-norm-2', 'decoder-cross-attn', 'decoder-add-norm-1', 'decoder-masked-attn']
      : ['decoder-stack'];
    const head = ['output-probs', 'softmax', 'linear'];
    return [...base, ...stack, ...head].reverse();
  };

  const selectedComponent = selectedId ? ARCHITECTURE_DATA[selectedId] : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[850px] lg:h-[700px] w-full bg-slate-100 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 overflow-hidden relative">
      
      {/* --- Control Header --- */}
      <div className="absolute top-6 left-6 z-20">
        <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
          <Box className="w-5 h-5 text-indigo-500" />
          3D Structural View
        </h3>
        <p className="text-sm text-slate-500 mt-1 mb-4 max-w-xs">
          Spatial visualization of the parallel stacks.
        </p>
        
        <div className="flex gap-2">
           {/* Controls removed for cleaner UI since Diagram covers the 'Compact' explanation */}
        </div>
      </div>

      {/* --- 3D Stage --- */}
      <div 
        className="lg:col-span-2 relative flex items-center justify-center perspective-container overflow-hidden select-none"
        onClick={() => setSelectedId(null)}
      >
        {/* Background Decorations */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-200/50 via-transparent to-transparent dark:from-slate-800/30 opacity-50 pointer-events-none" />

        {/* The Isometric Scene Container */}
        <motion.div 
          className="relative w-full max-w-lg h-full flex items-center justify-center transform-style-3d"
          initial={false}
          animate={{ 
            rotateX: 10, // Slight tilt
            scale: detailedMode ? 0.85 : 1 
          }}
          transition={{ duration: 0.8 }}
        >
          {/* --- ENCODER COLUMN (Left) --- */}
          <div className="absolute transform-style-3d transition-transform duration-700" style={{ transform: 'translateX(-140px)' }}>
            <div className="absolute -top-48 left-1/2 -translate-x-1/2 text-xs font-bold tracking-widest text-slate-400 uppercase">Encoder</div>
            {getEncoderItems().map((key, index) => {
              const data = ARCHITECTURE_DATA[key];
              if (!data) return null;
              // Calculate Y position: Stack them up. 
              // Detailed mode has more items, so tighter spacing
              const spacing = detailedMode ? 50 : 60;
              const yPos = (index - getEncoderItems().length / 2) * spacing;
              
              return (
                <Block3D 
                  key={`enc-${key}`}
                  data={data}
                  isSelected={selectedId === key}
                  onClick={() => setSelectedId(key)}
                  yOffset={yPos}
                  delay={index}
                  // Slightly rotated for isometric look
                  // We handle rotation in the parent usually, but here we can just stack 2D planes that look 3D or use the Block3D internal styling
                />
              );
            })}
          </div>

          {/* --- CROSS ATTENTION ARROW --- */}
          <AnimatePresence>
            {detailedMode && (
               <motion.div 
                 initial={{ opacity: 0, pathLength: 0 }}
                 animate={{ opacity: 1, pathLength: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute z-0 pointer-events-none"
                 style={{ width: 300, height: 100, top: -50, left: -150 }}
               >
                 {/* SVG Curve connecting Encoder to Decoder Cross Attn */}
                 <svg width="100%" height="100%" viewBox="0 0 300 100" fill="none" className="overflow-visible">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
                        </marker>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
                        </linearGradient>
                    </defs>
                    <motion.path 
                        d="M 80 50 C 150 50, 150 50, 220 50" 
                        stroke="url(#grad1)" 
                        strokeWidth="3" 
                        fill="none"
                        strokeDasharray="6 4"
                        markerEnd="url(#arrowhead)"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "linear" }}
                    />
                    <text x="150" y="40" textAnchor="middle" className="text-[10px] fill-slate-400 font-mono">Keys & Values</text>
                 </svg>
               </motion.div>
            )}
          </AnimatePresence>


          {/* --- DECODER COLUMN (Right) --- */}
          <div className="absolute transform-style-3d transition-transform duration-700" style={{ transform: 'translateX(140px)' }}>
            <div className="absolute -top-64 left-1/2 -translate-x-1/2 text-xs font-bold tracking-widest text-slate-400 uppercase">Decoder</div>
            {getDecoderItems().map((key, index) => {
              const data = ARCHITECTURE_DATA[key];
              if (!data) return null;
              const spacing = detailedMode ? 50 : 60;
              const yPos = (index - getDecoderItems().length / 2) * spacing;
              
              return (
                <Block3D 
                  key={`dec-${key}`}
                  data={data}
                  isSelected={selectedId === key}
                  onClick={() => setSelectedId(key)}
                  yOffset={yPos}
                  delay={index + 5} // Delay after encoder
                />
              );
            })}
          </div>

        </motion.div>
        
        {/* Instruction Tip */}
        {!selectedId && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 text-slate-400 text-sm flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 px-4 py-2 rounded-full backdrop-blur-sm border border-slate-200 dark:border-slate-700"
            >
                <Box className="w-4 h-4" />
                <span>Click to isolate component</span>
            </motion.div>
        )}
      </div>

      {/* --- Detail Panel (Right Side) --- */}
      <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm p-6 flex flex-col">
        <AnimatePresence mode="wait">
          {selectedComponent ? (
            <motion.div
              key={selectedComponent.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              <div className="flex items-start justify-between mb-6">
                <div className={cn("p-3 rounded-xl shadow-sm inline-flex", selectedComponent.color)}>
                    <Zap className="w-6 h-6 text-slate-800 dark:text-white" />
                </div>
                <button 
                    onClick={() => setSelectedId(null)}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {selectedComponent.label}
              </h2>
              <span className="inline-block px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-mono mb-6 self-start">
                {selectedComponent.group.toUpperCase()}
              </span>

              <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2">
                <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2 flex items-center gap-2">
                        <Info className="w-4 h-4" /> Purpose
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {selectedComponent.description}
                    </p>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2">
                        Technical Details
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {selectedComponent.detailedText}
                    </p>
                </div>
              </div>
              
            </motion.div>
          ) : (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center text-slate-400"
            >
                <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Layers className="w-8 h-8 opacity-50" />
                </div>
                <p className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-2">Select a component</p>
                <p className="text-sm max-w-[200px]">Click on any block in the 3D view to inspect its spatial position.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Architecture3D;
