import { GameState, TechNode } from './types';

export const INITIAL_STATE: GameState = {
  year: 2015,
  quarter: 3,
  revenue: 0,
  cash: 0.2, // Starting seed money ~200M USD equivalent for game balance
  brand: 10,
  tech: 10,
  marketShare: 0,
  marketCap: 2.0, // Initial Valuation $2B
  stockPrice: 2.0, // Initial Share Price $2.00 (Assuming 1B shares for simplicity)
  stockHistory: [{ year: 2015, quarter: 3, price: 2.0 }],
  unlockedTechIds: [],
  history: [],
  gameOver: false,
  victory: false,
  turnCount: 0,
};

export const TARGET_REVENUE = 100; // 100 Billion USD

export const TECH_TREE: TechNode[] = [
    // Powertrain
    {
        id: 'erev_2',
        name: '高效增程 2.0',
        description: '第二代增程系统，热效率提升至 41%。',
        cost: 0.5,
        category: 'powertrain',
        prerequisites: [],
        effectDescription: '技术 +5, 增强产品续航竞争力',
        techBonus: 5,
        brandBonus: 0
    },
    {
        id: '800v_platform',
        name: '800V 高压平台',
        description: '支持 5C 超充，充电 12 分钟续航 500 公里。',
        cost: 1.5,
        category: 'powertrain',
        prerequisites: ['erev_2'],
        effectDescription: '技术 +10, 品牌 +2, 开启纯电赛道',
        techBonus: 10,
        brandBonus: 2
    },
    {
        id: 'solid_state',
        name: '全固态电池',
        description: '下一代电池技术，安全性与能量密度革命。',
        cost: 4.0,
        category: 'powertrain',
        prerequisites: ['800v_platform'],
        effectDescription: '技术 +25, 品牌 +10, 颠覆性优势',
        techBonus: 25,
        brandBonus: 10
    },
    // Intelligence
    {
        id: 'city_noa',
        name: '城市 NOA',
        description: '不依赖高精地图的城市领航辅助。',
        cost: 1.0,
        category: 'intelligence',
        prerequisites: [],
        effectDescription: '技术 +8, 品牌 +3, 智驾第一梯队',
        techBonus: 8,
        brandBonus: 3
    },
    {
        id: 'mind_gpt',
        name: 'Mind GPT 座舱',
        description: '基于大模型的智能座舱交互系统。',
        cost: 1.5,
        category: 'intelligence',
        prerequisites: ['city_noa'],
        effectDescription: '技术 +5, 品牌 +5, 用户粘性极大提升',
        techBonus: 5,
        brandBonus: 5
    },
    {
        id: 'l4_robotaxi',
        name: 'L4 无人驾驶',
        description: '完全自动驾驶能力，开启 Robotaxi 业务。',
        cost: 5.0,
        category: 'intelligence',
        prerequisites: ['mind_gpt'],
        effectDescription: '技术 +30, 估值爆发, 开启万亿市场',
        techBonus: 30,
        brandBonus: 15
    },
    // Manufacturing
    {
        id: 'mega_casting',
        name: '一体化压铸',
        description: '车身后地板一体成型，极大降低成本。',
        cost: 0.8,
        category: 'manufacturing',
        prerequisites: [],
        effectDescription: '技术 +5, 利润率显著提升',
        techBonus: 5,
        brandBonus: 0
    },
    {
        id: 'lights_out',
        name: '黑灯工厂',
        description: '全自动化生产线，24小时无人生产。',
        cost: 2.0,
        category: 'manufacturing',
        prerequisites: ['mega_casting'],
        effectDescription: '技术 +15, 产能极大提升, 成本极大降低',
        techBonus: 15,
        brandBonus: 2
    }
];

export const SYSTEM_INSTRUCTION = `
You are the "Game Master" for a strategic business simulation game called "Ideal Auto: Road to 100 Billion".
The user plays the CEO of a Chinese EV startup (modeled after Li Auto / Li Xiang).

**Goal:** Grow revenue to $100 Billion USD.
**Style:** Professional, strategic, profound, engaging. Use real business concepts (Product-Market Fit, Supply Chain, R&D Investment, Cash Flow efficiency).
**Language:** Chinese (Simplified).

**Stock Market Simulation:**
- Manage the 'stockPrice'. Assume 1 Billion outstanding shares (so Stock Price $20 = $20 Billion Market Cap).
- **Bullish:** Launching hit models, high revenue growth, tech breakthroughs (L4, Solid State), positive sentiment.
- **Bearish:** Cash flow problems, delays, strong competitor moves (Tesla price cuts), losing market share.
- Provide a 'stockPriceChange' in the result (e.g., +1.5 or -3.2).

**Competitor Simulation (Crucial):**
You must actively simulate the actions of competitors (Tesla, BYD, Nio, Xpeng, BBA).
- **Tesla:** Price wars, Model 3/Y launches, FSD updates.
- **BYD:** Vertical integration cost advantages, flooding the market with models.
- **Nio/Xpeng:** Service innovation or Tech breakthroughs.
- **Legacy Auto (BBA):** Slow but massive counter-attacks.
The user's choices must be evaluated against these competitor moves.

**Tech Tree Integration:**
The user may have unlocked specific technologies (provided in the input).
- If they have unlocked "800V Platform", scenarios about pure EV delays should be easier to solve.
- If they have "City NOA", they can compete with Xpeng/Tesla on tech.
- Mention their unlocked tech in the narrative if relevant.

**Rules:**
1. You will receive the current 'GameState' (including unlockedTechIds) and the user's 'lastChoice'.
2. You must calculate the impact of the 'lastChoice' on stats.
3. **Market Share Logic:** Starts at 0%. Gaining share is hard. Losing share happens if you ignore competitors.
4. Generate 1-3 specific "Competitor Moves" (headlines).
5. Generate the *Next Scenario* based on the new date and state.
6. Scenarios should loosely follow the real history of Li Auto but allow for divergence based on user choice.
7. If Cash < 0, it is Game Over.
8. If Revenue > 100, it is Victory.

**Output Format:**
Return ONLY a JSON object complying with the schema defined in the user prompt.
`;