import React from 'react';
import { Scenario, TurnResult } from '../types';
import { ArrowRight, Activity, Zap, Swords } from 'lucide-react';

interface EventDisplayProps {
  scenario: Scenario;
  previousResult?: TurnResult;
  onChoiceSelect: (id: string) => void;
  loading: boolean;
}

const EventDisplay: React.FC<EventDisplayProps> = ({ scenario, previousResult, onChoiceSelect, loading }) => {
  
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
      
      {/* Previous Turn Analysis (Feedback) */}
      {previousResult && (
        <div className="grid gap-4 animate-fade-in-down">
            {/* Main Result */}
            <div className="bg-slate-800/80 border-l-4 border-amber-500 p-6 rounded-r-xl shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                    <Activity className="text-amber-500" size={20} />
                    <h3 className="text-amber-500 font-bold uppercase text-sm tracking-wider">上一轮决策分析</h3>
                </div>
                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                    {previousResult.narrative}
                </p>
                <div className="flex flex-wrap gap-4 mt-4 text-xs font-mono text-slate-400">
                    {previousResult.revenueChange !== 0 && (
                        <span className={previousResult.revenueChange > 0 ? "text-green-400" : "text-red-400"}>
                        Rev {previousResult.revenueChange > 0 ? "+" : ""}{previousResult.revenueChange.toFixed(2)}B
                        </span>
                    )}
                    {previousResult.cashChange !== 0 && (
                        <span className={previousResult.cashChange > 0 ? "text-green-400" : "text-red-400"}>
                        Cash {previousResult.cashChange > 0 ? "+" : ""}{previousResult.cashChange.toFixed(2)}B
                        </span>
                    )}
                     {previousResult.marketShareChange !== 0 && (
                        <span className={previousResult.marketShareChange > 0 ? "text-cyan-400" : "text-pink-400"}>
                        Share {previousResult.marketShareChange > 0 ? "+" : ""}{previousResult.marketShareChange.toFixed(2)}%
                        </span>
                    )}
                </div>
            </div>

            {/* Competitor Intelligence */}
            {previousResult.competitorMoves && previousResult.competitorMoves.length > 0 && (
                <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                        <Swords className="text-red-400" size={18} />
                        <h3 className="text-red-400 font-bold uppercase text-xs tracking-wider">竞对情报 Market Intelligence</h3>
                    </div>
                    <ul className="space-y-2">
                        {previousResult.competitorMoves.map((move, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                                <Zap size={14} className="mt-1 text-yellow-500 shrink-0" />
                                <span>{move}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
      )}

      {/* Current Scenario Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl relative">
        {/* Scenario Header */}
        <div className="p-6 md:p-8 border-b border-slate-700/50">
            <div className="flex justify-between items-start mb-4">
                <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-xs font-mono">
                    {scenario.year_context}
                </span>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                {scenario.title}
            </h2>
            <div className="text-slate-300 text-base md:text-lg leading-relaxed space-y-4">
                {scenario.description.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                ))}
            </div>
        </div>

        {/* Choices Area */}
        <div className="p-6 md:p-8 bg-slate-900/50">
            <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">做出您的战略选择</h4>
            <div className="grid gap-4">
                {scenario.choices.map((choice) => (
                    <button
                        key={choice.id}
                        onClick={() => onChoiceSelect(choice.id)}
                        disabled={loading}
                        className={`
                            group text-left p-5 rounded-xl border transition-all duration-300 relative overflow-hidden
                            ${loading 
                                ? "border-slate-800 opacity-50 cursor-not-allowed" 
                                : "border-slate-700 hover:border-amber-500/50 hover:bg-slate-800 hover:shadow-lg hover:shadow-amber-500/10 active:scale-[0.99]"
                            }
                        `}
                    >
                        <div className="flex justify-between items-center relative z-10">
                            <div>
                                <span className="block font-bold text-lg text-slate-200 group-hover:text-amber-400 transition-colors">
                                    {choice.text}
                                </span>
                                {choice.description && (
                                    <span className="block text-sm text-slate-500 mt-1 group-hover:text-slate-400">
                                        {choice.description}
                                    </span>
                                )}
                            </div>
                            <ArrowRight className="text-slate-600 group-hover:text-amber-500 transform group-hover:translate-x-1 transition-all" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
        
        {/* Loading Overlay */}
        {loading && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                <div className="w-16 h-16 border-4 border-slate-700 border-t-amber-500 rounded-full animate-spin mb-4"></div>
                <p className="text-amber-500 font-mono animate-pulse">正在获取市场情报...</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default EventDisplay;