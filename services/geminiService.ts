import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GameState, GameTurnResponse } from "../types";
import { SYSTEM_INSTRUCTION, TARGET_REVENUE, TECH_TREE } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const schema: Schema = {
  type: Type.OBJECT,
  properties: {
    result: {
      type: Type.OBJECT,
      nullable: true,
      properties: {
        narrative: { type: Type.STRING, description: "Analysis of the result of the previous choice." },
        competitorMoves: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of 1-3 specific actions taken by rivals (e.g. 'Tesla cuts Model Y price by 20%')"
        },
        revenueChange: { type: Type.NUMBER, description: "Change in revenue (can be negative)" },
        cashChange: { type: Type.NUMBER, description: "Change in cash reserves" },
        brandChange: { type: Type.NUMBER, description: "Change in brand value" },
        techChange: { type: Type.NUMBER, description: "Change in tech accumulation" },
        marketShareChange: { type: Type.NUMBER, description: "Change in market share percentage (e.g. 0.5 or -0.2)" },
        marketCapChange: { type: Type.NUMBER, description: "Change in market cap" },
        stockPriceChange: { type: Type.NUMBER, description: "Change in stock price (e.g., +2.5 or -1.0)" },
        isGameOver: { type: Type.BOOLEAN },
        gameOverReason: { type: Type.STRING, nullable: true },
      },
    },
    nextScenario: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        year_context: { type: Type.STRING, description: "e.g., '2016 Q2'" },
        choices: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              text: { type: Type.STRING },
              description: { type: Type.STRING },
            },
          },
        },
      },
    },
  },
  required: ["nextScenario"],
};

export const fetchNextTurn = async (
  currentState: GameState,
  lastChoiceId?: string
): Promise<GameTurnResponse> => {
  
  const model = "gemini-3-flash-preview";

  // Map IDs to Names for the AI context
  const unlockedTechNames = currentState.unlockedTechIds
    .map(id => TECH_TREE.find(t => t.id === id)?.name)
    .filter(Boolean)
    .join(", ");

  let prompt = "";
  if (!lastChoiceId) {
    prompt = `Initialize the game. Start at Year 2015. The user has just founded the company. 
    Create the first scenario regarding the initial product direction (e.g., SEV vs SUV). 
    No 'result' is needed for this first turn.`;
  } else {
    prompt = `
    Current State:
    Year: ${currentState.year}
    Revenue: $${currentState.revenue}B / $${TARGET_REVENUE}B
    Cash: $${currentState.cash}B
    Brand: ${currentState.brand}
    Tech: ${currentState.tech}
    Market Share: ${currentState.marketShare}%
    Stock Price: $${currentState.stockPrice} (Market Cap: $${currentState.marketCap}B)
    Unlocked Tech: [${unlockedTechNames}]
    
    User's Last Choice ID: "${lastChoiceId}"

    1. Evaluate the choice specifically against POTENTIAL COMPETITOR ACTIONS.
    2. Consider the user's Unlocked Tech.
    3. Calculate stock price impact based on market sentiment and financial results.
    4. Update stats.
    5. Generate the next strategic scenario.
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as GameTurnResponse;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback in case of severe error to prevent app crash
    return {
        result: {
            narrative: "市场环境发生剧烈波动，系统数据暂时中断...",
            competitorMoves: ["竞对信息获取失败"],
            revenueChange: 0,
            cashChange: 0,
            brandChange: 0,
            techChange: 0,
            marketShareChange: 0,
            marketCapChange: 0,
            stockPriceChange: 0,
            isGameOver: false
        },
        nextScenario: {
            title: "通讯故障",
            description: "请稍后重试连接董事会网络。",
            year_context: `${currentState.year}`,
            choices: [{ id: "retry", text: "重试连接" }]
        }
    };
  }
};