import React from 'react';
import { TechNode, GameState } from '../types';
import { TECH_TREE } from '../constants';
import { X, Lock, Check, Zap, Brain, Hammer } from 'lucide-react';

interface TechTreeProps {
  gameState: GameState;
  onClose: () => void;
  onResearch: (tech: TechNode) => void;
}

const TechTree: React.FC<TechTreeProps> = ({ gameState, onClose, onResearch }) => {
  const { unlockedTechIds, cash } = gameState;

  // Group techs by category
  const categories = {
    powertrain: TECH_TREE.filter(t => t.category === 'powertrain'),
    intelligence: TECH_TREE.filter(t => t.category === 'intelligence'),
    manufacturing: TECH_TREE.filter(t => t.category === 'manufacturing'),
  };

  const getStatus = (tech: TechNode) => {
    if (unlockedTechIds.includes(tech.id)) return 'researched';
    const prereqsMet = tech.prerequisites.every(id => unlockedTechIds.includes(id));
    if (prereqsMet) return 'available';
    return 'locked';
  };

  const renderCategory = (title: string, icon: React.ReactNode, techs: TechNode[], colorClass: string) => (
    <div className="flex-1 min-w-[300px] flex flex-col gap-4">
      <div className={`flex items-center gap-2 text-lg font-bold uppercase tracking-wider ${colorClass} mb-2`}>
        {icon}
        {title}
      </div>
      <div className="space-y-6 relative">
         {/* Vertical connector line */}
         <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-700/50 -z-10"></div>
         
         {techs.map((tech) => {
           const status = getStatus(tech);
           const canAfford = cash >= tech.cost;
           
           return (
             <div 
                key={tech.id} 
                className={`
                   relative p-4 rounded-xl border-2 transition-all duration-300 flex flex-col gap-2 group
                   ${status === 'researched' 
                      ? 'bg-slate-800/80 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
                      : status === 'available'
                        ? 'bg-slate-800 border-slate-600 hover:border-amber-500 hover:shadow-lg'
                        : 'bg-slate-900/50 border-slate-800 opacity-70 grayscale'}
                `}
             >
                <div className="flex justify-between items-start">
                   <h4 className={`font-bold ${status === 'researched' ? 'text-green-400' : 'text-slate-200'}`}>
                     {tech.name}
                   </h4>
                   {status === 'researched' ? (
                     <Check size={18} className="text-green-500" />
                   ) : status === 'locked' ? (
                     <Lock size={16} className="text-slate-600" />
                   ) : (
                     <div className="px-2 py-0.5 bg-slate-700 rounded text-xs text-amber-400 font-mono">
                       ${tech.cost}B
                     </div>
                   )}
                </div>
                
                <p className="text-xs text-slate-400 leading-relaxed">{tech.description}</p>
                
                <div className="text-xs font-mono text-slate-500 pt-2 border-t border-slate-700/50 mt-1">
                   Effect: <span className="text-slate-300">{tech.effectDescription}</span>
                </div>

                {status === 'available' && (
                  <button 
                    onClick={() => canAfford && onResearch(tech)}
                    disabled={!canAfford}
                    className={`
                      mt-2 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2
                      ${canAfford 
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg' 
                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'}
                    `}
                  >
                    {canAfford ? '投入研发' : `资金不足 (需 $${tech.cost}B)`}
                  </button>
                )}
             </div>
           );
         })}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-6xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50 rounded-t-2xl">
           <div>
             <h2 className="text-2xl font-bold text-white flex items-center gap-3">
               <Brain className="text-blue-400" />
               理想汽车研发中心
             </h2>
             <p className="text-slate-400 text-sm mt-1">
               Current Cash: <span className={cash < 1 ? 'text-red-400' : 'text-emerald-400'}>${cash.toFixed(2)}B</span>
             </p>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white">
             <X size={24} />
           </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
           <div className="flex flex-col md:flex-row gap-8">
              {renderCategory('三电与增程', <Zap size={20} />, categories.powertrain, 'text-green-400')}
              {renderCategory('智能驾驶', <Brain size={20} />, categories.intelligence, 'text-blue-400')}
              {renderCategory('先进制造', <Hammer size={20} />, categories.manufacturing, 'text-orange-400')}
           </div>
        </div>

      </div>
    </div>
  );
};

export default TechTree;