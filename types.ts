export interface GameState {
  year: number;
  quarter: number;
  revenue: number; // In Billions USD
  cash: number; // In Billions USD
  brand: number; // 0-100
  tech: number; // 0-100
  marketShare: number; // Percentage (0-100)
  marketCap: number; // In Billions USD
  stockPrice: number; // In USD
  stockHistory: { year: number; quarter: number; price: number }[];
  unlockedTechIds: string[]; // List of researched tech IDs
  history: string[]; // Log of events for context
  gameOver: boolean;
  victory: boolean;
  turnCount: number;
}

export interface Choice {
  id: string;
  text: string;
  description?: string; // Hidden nuance
}

export interface Scenario {
  title: string;
  description: string;
  year_context: string;
  choices: Choice[];
  img_prompt_context?: string; // Hint for UI visuals if needed
}

export interface TurnResult {
  narrative: string; // What happened after the choice
  competitorMoves: string[]; // List of actions taken by rivals (Tesla, BYD, etc.)
  revenueChange: number;
  cashChange: number;
  brandChange: number;
  techChange: number;
  marketShareChange: number;
  marketCapChange: number; // Kept for backward compatibility or direct valuation shifts
  stockPriceChange: number; // Specific change in share price
  isGameOver: boolean;
  gameOverReason?: string;
}

export interface GameTurnResponse {
  result?: TurnResult; // Result of the PREVIOUS choice (null on first turn)
  nextScenario: Scenario;
}

export interface TechNode {
  id: string;
  name: string;
  description: string;
  cost: number; // Billions
  category: 'powertrain' | 'intelligence' | 'manufacturing';
  prerequisites: string[];
  effectDescription: string;
  techBonus: number;
  brandBonus: number;
}