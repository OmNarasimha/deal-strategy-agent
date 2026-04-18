/**
 * CORE DATA MODELS FOR DEALINTEL
 */

export interface Interaction {
  id: string;
  deal_id: number;
  transcript: string;
  stage: 'Discovery' | 'Demo' | 'Negotiation' | 'Closing';
  objections: string[];
  competitors: string[];
  risks: string[];
  opportunities: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  summary: string;
  timestamp: string;
  outcome: 'won' | 'lost' | 'pending';
  // PHASE 2: Omnichannel support
  source?: 'Call' | 'Email' | 'LinkedIn' | 'PDF'; 
}

/**
 * EVIDENCE INTERFACE
 * Used for the "Explain AI" feature to show the RAG audit trail.
 */
export interface Evidence {
  interaction_id: string;
  source_call: string;
  detected_signal: string;
  match_score?: string; // e.g., "94% Match"
}

/**
 * WINNING PATTERN INTERFACE
 * Supports institutional knowledge sharing across the network.
 */
export interface WinningPattern {
  pattern: string;
  success_rate: string;
  context: string;
  isGlobal?: boolean; // NEW: Marks if learned from another user/office
}

/**
 * AI STRATEGY INTERFACE
 * Upgraded for "Glass Box" transparency and Semantic Match logic.
 */
export interface AIStrategy {
  summary: string;
  risks: string[];
  strategy: string;
  learned_insight: string;
  success_probability: number;
  winning_pattern_used: string;
  script: string;
  memory_count: number;
  similar_deal_count: number;
  key_influence: string; 
  used_memories: Evidence[]; // The "Glass Box" audit trail
  reasoning: string;         // The strategist's core logic
}

/**
 * SERVICE STRUCTURE (IMemoryLayer)
 * Defined contract for deal persistence and the Intelligence Engine.
 */
export interface IMemoryLayer {
  // Persistence & Retrieval
  addMemory(interaction: Interaction): Promise<any>;
  getMemoriesByDeal(dealId: number): Promise<Interaction[]>;
  deleteMemory(id: string): Promise<{ success: boolean }>;
  updateMemory(id: string, updates: Partial<Interaction>): Promise<{ success: boolean }>;
  
  // Intelligence & Analytics
  searchSimilarMemories(query: string): Promise<any[]>;
  getWinningPatterns(): Promise<WinningPattern[]>;
  updateDealOutcome(dealId: number, outcome: 'won' | 'lost'): Promise<{ success: boolean }>;
  calculateWinProbability(currentInteractions: Interaction[]): Promise<number>;
  
  // Demo Infrastructure
  seedDemoData(dealId: number): Promise<void>;
}