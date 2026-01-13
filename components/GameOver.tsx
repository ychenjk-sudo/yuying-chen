import React from 'react';
import { GameState } from '../types';
import { RefreshCw, Award, AlertTriangle } from 'lucide-react';

interface GameOverProps {
    state: GameState;
    onRestart: () => void;
    reason?: string;
}

const GameOver: React.FC<GameOverProps> = ({ state, onRestart, reason }) => {
    const isVictory = state.victory;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-md">
            <div className="max-w-lg w-full bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-8 text-center">
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${isVictory ? 'bg-amber-500/20 text-amber-500' : 'bg-red-500/20 text-red-500'}`}>
                    {isVictory ? <Award size={40} /> : <AlertTriangle size={40} />}
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-2">
                    {isVictory ? "千亿达成！" : "创业未半..."}
                </h2>
                
                <p className="text-slate-300 mb-6 text-lg">
                    {reason || (isVictory ? "您成功带领理想汽车突破千亿营收，成为全球汽车巨头！" : "资金链断裂，公司不得不进行破产重组。")}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-900/50 p-4 rounded-xl">
                    <div className="text-center">
                        <div className="text-slate-500 text-xs uppercase">最终营收</div>
                        <div className="text-xl font-mono text-white">${state.revenue.toFixed(2)}B</div>
                    </div>
                    <div className="text-center">
                        <div className="text-slate-500 text-xs uppercase">最终年份</div>
                        <div className="text-xl font-mono text-white">{state.year}</div>
                    </div>
                </div>

                <button 
                    onClick={onRestart}
                    className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                    <RefreshCw size={20} />
                    再次挑战
                </button>
            </div>
        </div>
    );
};

export default GameOver;