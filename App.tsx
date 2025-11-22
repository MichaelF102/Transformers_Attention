
import React, { useState, useEffect } from 'react';
import { Moon, Sun, BookOpen, Github, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import ProcessingSimulator from './components/ProcessingSimulator';
import Architecture3D from './components/Architecture3D';
import AttentionLab from './components/AttentionLab';
import PositionalEncoding from './components/PositionalEncoding';
import PaperSummary from './components/PaperSummary';
import { cn } from './utils';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-rose-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                T
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">Transformer<span className="font-light opacity-70">Explainer</span></span>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                <ExternalLink className="w-3 h-3" />
                Read Paper
              </a>
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-grow">
        
        {/* HERO SECTION */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6 border border-indigo-200 dark:border-indigo-800">
                Vaswani et al. 2017
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
                Attention Is All <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500">You Need</span>
              </h1>
              <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-10">
                The paper that revolutionized NLP by introducing the <strong>Transformer</strong>—a model architecture based solely on attention mechanisms, dispensing with recurrence and convolutions.
              </p>
            </motion.div>

            <PaperSummary />

            <div className="space-y-16 mt-16">
                <div id="architecture">
                  <div className="flex items-center gap-4 mb-8 justify-center">
                     <div className="h-px bg-slate-200 dark:bg-slate-800 w-24" />
                     <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Model Architecture</h2>
                     <div className="h-px bg-slate-200 dark:bg-slate-800 w-24" />
                  </div>
                  
                  {/* Standard Diagram (New) */}
                  <div className="max-w-5xl mx-auto mb-12">
                    <ArchitectureDiagram />
                  </div>

                  {/* Interactive Simulation (New) */}
                  <div className="max-w-4xl mx-auto mb-12">
                    <ProcessingSimulator />
                  </div>

                  {/* 3D Visualization (Existing) */}
                  <div className="max-w-7xl mx-auto">
                    <Architecture3D />
                  </div>
                </div>
            </div>
          </div>
        </section>

        {/* ATTENTION SECTION */}
        <section className="py-24 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900">
          <div className="max-w-6xl mx-auto px-4">
             <AttentionLab />
          </div>
        </section>

        {/* POSITIONAL ENCODING SECTION */}
        <section className="py-24 bg-white dark:bg-black relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none" />
          <div className="max-w-6xl mx-auto px-4 relative z-10">
             <PositionalEncoding />
          </div>
        </section>

        {/* BOTTOM INFO */}
        <section className="py-20 text-center border-t border-slate-200 dark:border-slate-900 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-4xl mx-auto px-4">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Why this matters</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              The Transformer paved the way for BERT, GPT, T5, and essentially all modern Large Language Models (LLMs). 
              By enabling massive parallelization and capturing long-range dependencies efficiently, it scaled AI to where it is today.
            </p>
            <div className="text-sm text-slate-400">
              Visualization by <strong>Transformer Explainer</strong> &bull; Based on "Attention Is All You Need" (2017)
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default App;
