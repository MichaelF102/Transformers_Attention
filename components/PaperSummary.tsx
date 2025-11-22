import React from 'react';
import { FileText, Zap, Grid, Cpu } from 'lucide-react';

const PaperSummary: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
            <Zap className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white mb-2">Parallelization</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Unlike RNNs (LSTM/GRU), the Transformer dispenses with recurrence entirely. It processes whole sequences at once, allowing for massive parallelization on GPUs.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-4 text-rose-600 dark:text-rose-400">
            <Grid className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white mb-2">Self-Attention</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            It draws global dependencies between input and output. Each token can attend to every other token in the sequence, regardless of distance.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400">
            <Cpu className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white mb-2">Multi-Head</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Allows the model to jointly attend to information from different representation subspaces. One head might focus on grammar, another on semantic relationship.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
            <FileText className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white mb-2">SOTA Results</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Achieved 28.4 BLEU on WMT 2014 English-to-German translation, surpassing best ensembles at a fraction of the training cost (3.5 days on 8 P100s).
        </p>
      </div>
    </div>
  );
};

export default PaperSummary;
