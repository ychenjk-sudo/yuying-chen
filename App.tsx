import React, { useState, useEffect, useCallback } from 'react';
import { INITIAL_STATE, TARGET_REVENUE } from './constants';
import { GameState, Scenario, TurnResult, TechNode } from './types';
import { fetchNextTurn } from './services/geminiService';
import Dashboard from './components/Dashboard';
import EventDisplay from './components/EventDisplay';
import GameOver from './components/GameOver';
import TechTree from './components/TechTree';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [previousResult, setPreviousResult] = useState<TurnResult | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [revenueHistory, setRevenueHistory] = useState<{year: number, revenue: number}[]>([]);
  const [isTechTreeOpen, setIsTechTreeOpen] = useState(false);

  // Initialize game
  const startGame = useCallback(async () => {
    setLoading(true);
    setGameStarted(true);
    setGameState(INITIAL_STATE);
    setRevenueHistory([{year: INITIAL_STATE.year, revenue: 0}]);
    setPreviousResult(undefined);

    try {
      const response = await fetchNextTurn(INITIAL_STATE);
      setCurrentScenario(response.nextScenario);
    } catch (e) {
      console.error("Initialization failed", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChoice = async (choiceId: string) => {
    if (loading) return;
    setLoading(true);

    try {
      // API call with current state and choice
      const response = await fetchNextTurn(gameState, choiceId);

      // Process Result of the turn
      if (response.result) {
        setPreviousResult(response.result);

        // Update State based on AI calculation
        setGameState(prev => {
            const newRevenue = Math.max(0, prev.revenue + (response.result!.revenueChange || 0));
            const newCash = prev.cash + (response.result!.cashChange || 0);
            const newStockPrice = Math.max(0.1, prev.stockPrice + (response.result!.stockPriceChange || 0));
            
            // Basic game over logic
            const isBankrupt = newCash < 0;
            const isVictory = newRevenue >= TARGET_REVENUE;

            // Determine next date
            const nextYearRaw = parseInt(response.nextScenario.year_context.split(' ')[0]);
            const nextYear = isNaN(nextYearRaw) ? prev.year + 1 : nextYearRaw;
            const nextQuarter = prev.quarter === 4 ? 1 : prev.quarter + 1;

            const newState: GameState = {
                ...prev,
                revenue: newRevenue,
                cash: newCash,
                stockPrice: newStockPrice,
                marketCap: newStockPrice * 1.0, // Assuming 1B shares
                stockHistory: [...prev.stockHistory, { year: nextYear, quarter: nextQuarter, price: newStockPrice }],
                brand: Math.min(100, Math.max(0, prev.brand + (response.result!.brandChange || 0))),
                tech: Math.min(100, Math.max(0, prev.tech + (response.result!.techChange || 0))),
                marketShare: Math.max(0, prev.marketShare + (response.result!.marketShareChange || 0)),
                year: nextYear,
                quarter: nextQuarter,
                turnCount: prev.turnCount + 1,
                gameOver: isBankrupt || isVictory || (response.result!.isGameOver),
                victory: isVictory
            };

            // Update history chart
            setRevenueHistory(h => {
                const last = h[h.length - 1];
                if (last.year === newState.year) {
                    // update existing year
                    const newHist = [...h];
                    newHist[newHist.length -1].revenue = newState.revenue;
                    return newHist;
                } else {
                    return [...h, { year: newState.year, revenue: newState.revenue }];
                }
            });

            return newState;
        });
      }

      // Set Next Scenario
      setCurrentScenario(response.nextScenario);

    } catch (error) {
      console.error("Turn processing failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResearch = (tech: TechNode) => {
    if (gameState.cash >= tech.cost) {
      setGameState(prev => ({
        ...prev,
        cash: prev.cash - tech.cost,
        unlockedTechIds: [...prev.unlockedTechIds, tech.id],
        tech: prev.tech + tech.techBonus,
        brand: prev.brand + tech.brandBonus
      }));
    }
  };

  // Start Screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-[128px]"></div>
             <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[128px]"></div>
        </div>

        <div className="max-w-2xl text-center relative z-10">
          <div className="w-20 h-20 bg-amber-500 rounded-2xl mx-auto flex items-center justify-center text-4xl font-bold text-slate-900 mb-8 shadow-lg shadow-amber-500/20">
            LI
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            <span className="text-white">理想之路</span>
            <span className="text-amber-500 block text-3xl md:text-4xl mt-2 font-light tracking-widest">ROAD TO 100 BILLION</span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-xl mx-auto">
            假如你是理想汽车的 CEO，你需要在残酷的商业竞争中做出关键抉择。
            <br/>面对 Tesla、BBA 和造车新势力的围剿，你能突围吗？
          </p>
          <button 
            onClick={startGame}
            className="px-10 py-4 bg-white text-slate-900 text-lg font-bold rounded-full hover:bg-amber-400 hover:scale-105 transition-all duration-300 shadow-xl"
          >
            开始创业
          </button>
          
          <div className="mt-12 grid grid-cols-3 gap-8 text-slate-500 text-sm">
             <div>
                <strong className="block text-slate-300 mb-1">极致产品</strong>
                User Experience
             </div>
             <div>
                <strong className="block text-slate-300 mb-1">增程/纯电</strong>
                Technology Route
             </div>
             <div>
                <strong className="block text-slate-300 mb-1">组织效率</strong>
                Management
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30">
      <div className="container mx-auto px-4 py-6 md:py-10 max-w-6xl">
        
        <Dashboard 
            state={gameState} 
            revenueHistory={revenueHistory} 
            onOpenTechTree={() => setIsTechTreeOpen(true)}
        />
        
        {currentScenario && (
          <EventDisplay 
            scenario={currentScenario} 
            previousResult={previousResult}
            onChoiceSelect={handleChoice}
            loading={loading}
          />
        )}

      </div>

      {isTechTreeOpen && (
        <TechTree 
            gameState={gameState} 
            onClose={() => setIsTechTreeOpen(false)} 
            onResearch={handleResearch} 
        />
      )}

      {gameState.gameOver && (
        <GameOver 
            state={gameState} 
            onRestart={startGame} 
            reason={previousResult?.gameOverReason}
        />
      )}
    </div>
  );
};

export default App;