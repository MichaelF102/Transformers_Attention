import React, { useEffect, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

const PositionalEncoding: React.FC = () => {
  const [pos, setPos] = useState(50); // Current position focus
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const newData = [];
    // Generating data for the graph: x = position, y = embedding value for specific dimensions
    // PE(pos, 2i) = sin(pos / 10000^(2i/dmodel))
    // PE(pos, 2i+1) = cos(pos / 10000^(2i/dmodel))
    // Let's visualize dimensions 0, 4, and 8 (varying frequencies)
    
    for (let p = 0; p <= 100; p++) {
      const dim0 = Math.sin(p / Math.pow(10000, 0 / 512));
      const dim4 = Math.sin(p / Math.pow(10000, 4 / 512)); // Lower freq
      const dim32 = Math.sin(p / Math.pow(10000, 32 / 512)); // Much lower freq

      newData.push({
        pos: p,
        dim0,
        dim4,
        dim32
      });
    }
    setData(newData);
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-amber-500" />
            Positional Encoding
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Since the Transformer contains no recurrence or convolution, it needs to inject information about the relative or absolute position of tokens.
            It uses sine and cosine functions of different frequencies.
          </p>
        </div>
        <div className="mt-4 md:mt-0 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-lg border border-amber-200 dark:border-amber-800/50">
             <div className="text-xs font-mono text-amber-600 dark:text-amber-400">
                PE(pos, 2i) = sin(pos / 10000^(2i/d))
             </div>
        </div>
      </div>

      <div className="h-[300px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
            <XAxis 
                dataKey="pos" 
                label={{ value: 'Position (t)', position: 'insideBottomRight', offset: -5 }} 
                stroke="#64748b"
                fontSize={12}
            />
            <YAxis stroke="#64748b" fontSize={12} domain={[-1.2, 1.2]} />
            <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
            />
            <Line type="monotone" dataKey="dim0" stroke="#f59e0b" strokeWidth={2} dot={false} name="High Freq (Dim 0)" />
            <Line type="monotone" dataKey="dim4" stroke="#3b82f6" strokeWidth={2} dot={false} name="Mid Freq (Dim 4)" />
            <Line type="monotone" dataKey="dim32" stroke="#ec4899" strokeWidth={2} dot={false} name="Low Freq (Dim 32)" />
            
            {/* Interactive Reference Line */}
            {/* Note: Recharts ReferenceLine is static, visualizing active position manually via overlay would be complex, simplified here */}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
        <p>
            <strong>Why Sinusoids?</strong> The authors hypothesized that it would allow the model to easily learn to attend by relative positions, 
            since for any fixed offset <i className="font-serif">k</i>, <span className="font-serif">PE<sub>pos+k</sub></span> can be represented as a linear function of <span className="font-serif">PE<sub>pos</sub></span>.
        </p>
      </div>
    </div>
  );
};

export default PositionalEncoding;