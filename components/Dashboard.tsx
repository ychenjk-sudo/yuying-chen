import React, { useState, useEffect, useRef } from 'react';
import { GameState } from '../types';
import { TARGET_REVENUE } from '../constants';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, CartesianGrid 
} from 'recharts';
import { TrendingUp, DollarSign, Cpu, Award, PieChart as PieChartIcon, FlaskConical, LineChart } from 'lucide-react';

interface DashboardProps {
  state: GameState;
  revenueHistory: { year: number; revenue: number }[];
  onOpenTechTree: () => void;
}

const StatCard: React.FC<{ 
  label: string; 
  value: string; 
  icon: React.ReactNode; 
  subValue?: string; 
  color?: string;
}> = ({ label, value, icon, subValue, color = "text-white" }) => {
  const [highlight, setHighlight] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      setHighlight(true);
      const timer = setTimeout(() => setHighlight(false), 600);
      prevValueRef.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <div className={`
      relative overflow-hidden
      bg-slate-800/50 border p-4 rounded-xl flex flex-col justify-between backdrop-blur-sm
      transition-all duration-500 ease-out
      ${highlight ? 'border-amber-500/40 bg-slate-700/60 shadow-[0_0_20px_rgba(245,158,11,0.15)] scale-[1.02]' : 'border-slate-700 shadow-none scale-100'}
    `}>
      <div className="flex justify-between items-start mb-2 relative z-10">
        <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">{label}</span>
        <div className={`p-2 rounded-lg bg-slate-700/50 ${color} transition-transform duration-500 ${highlight ? 'rotate-12 scale-110' : ''}`}>
          {icon}
        </div>
      </div>
      <div className="relative z-10">
        <div className={`text-2xl font-bold font-mono tracking-tight transition-all duration-300 ${highlight ? 'text-white translate-x-1' : ''}`}>
          {value}
        </div>
        {subValue && <div className="text-xs text-slate-500 mt-1">{subValue}</div>}
      </div>
      
      {/* Subtle background glow effect */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-white/5 to-white/0 rounded-full blur-xl transition-opacity duration-500 ${highlight ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ state, revenueHistory, onOpenTechTree }) => {
  const [chartMode, setChartMode] = useState<'revenue' | 'stock'>('stock');
  const progress = (state.revenue / TARGET_REVENUE) * 100;

  // Format stock history for chart
  const stockChartData = state.stockHistory.map(h => ({
    name: `${h.year} Q${h.quarter}`,
    price: h.price
  }));

  return (
    <div className="w-full max-w-5xl mx-auto mb-6 space-y-4">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-slate-900 text-xl shadow-lg shadow-amber-500/20">LI</div>
          <div>
            <h1 className="text-xl font-bold text-white">理想汽车 CEO 驾驶舱</h1>
            <p className="text-slate-400 text-xs">战略决策系统 | {state.year}年 Q{state.quarter}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            {/* Tech Tree Button */}
            <button 
                onClick={onOpenTechTree}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
                <FlaskConical size={18} />
                <span className="font-bold text-sm">研发中心</span>
            </button>

            <div className="text-right hidden lg:block">
                <p className="text-amber-500 font-mono text-sm">Target: $100 Billion</p>
                <div className="w-48 h-2 bg-slate-700 rounded-full mt-1 overflow-hidden relative">
                    <div 
                        className="h-full bg-amber-500 transition-all duration-1000 ease-out relative" 
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    >
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 blur-[1px]"></div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard 
          label="年营收 (Revenue)" 
          value={`$${state.revenue.toFixed(2)} B`} 
          subValue={`目标完成度: ${progress.toFixed(1)}%`}
          icon={<TrendingUp size={18} />}
          color="text-amber-400"
        />
        <StatCard 
          label="现金流 (Cash)" 
          value={`$${state.cash.toFixed(2)} B`} 
          subValue="企业生命线"
          icon={<DollarSign size={18} />}
          color={state.cash < 1 ? "text-red-400" : "text-emerald-400"}
        />
        <StatCard 
          label="股价 (Stock)" 
          value={`$${state.stockPrice.toFixed(2)}`} 
          subValue={`市值: $${state.marketCap.toFixed(2)} B`}
          icon={<LineChart size={18} />}
          color={state.stockPrice > 10 ? "text-green-400" : "text-yellow-400"}
        />
        <StatCard 
          label="品牌势能 (Brand)" 
          value={`${state.brand.toFixed(0)}`} 
          subValue="/ 100 Index"
          icon={<Award size={18} />}
          color="text-purple-400"
        />
        <StatCard 
          label="技术储备 (Tech)" 
          value={`${state.tech.toFixed(0)}`} 
          subValue="/ 100 Index"
          icon={<Cpu size={18} />}
          color="text-blue-400"
        />
      </div>

      {/* Chart Area */}
      <div className="hidden md:block bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 h-56 relative">
        <div className="flex justify-between items-center mb-4">
            <p className="text-xs text-slate-400 uppercase tracking-widest">
                {chartMode === 'stock' ? '股价走势 (Stock Trend)' : '营收增长 (Revenue Growth)'}
            </p>
            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                <button 
                    onClick={() => setChartMode('stock')}
                    className={`px-3 py-1 text-xs rounded-md transition-all ${chartMode === 'stock' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    股价
                </button>
                <button 
                    onClick={() => setChartMode('revenue')}
                    className={`px-3 py-1 text-xs rounded-md transition-all ${chartMode === 'revenue' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    营收
                </button>
            </div>
        </div>
        
        <ResponsiveContainer width="100%" height="80%">
          {chartMode === 'revenue' ? (
              <BarChart data={revenueHistory}>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#fbbf24' }}
                  cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]} animationDuration={1000}>
                  {revenueHistory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === revenueHistory.length - 1 ? '#f59e0b' : '#475569'} />
                  ))}
                </Bar>
              </BarChart>
          ) : (
              <AreaChart data={stockChartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#34d399' }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Stock Price']}
                  />
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                    strokeWidth={2}
                    animationDuration={1500}
                  />
              </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;