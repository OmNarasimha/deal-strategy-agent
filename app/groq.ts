import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true 
});

/**
 * STEP 3: OMNICHANNEL INTELLIGENT EXTRACTION
 * Now supports content differentiation based on source (Call, Email, LinkedIn, PDF).
 */
export const extractInsights = async (content: string, source: string = 'Call') => {
  const prompt = `
    You are a Senior Deal Desk Analyst. Analyze the provided ${source} content to extract strategic intelligence.
    
    CONTEXT: This data originates from a ${source}. 
    - For Emails/PDFs: Focus on hard commitments, formal objections, and contractual risks.
    - For Calls/LinkedIn: Focus on tonal shifts, informal skepticism, and expansion signals.

    CONTENT: "${content}"

    Return ONLY a JSON object with these EXACT keys:
    {
      "summary": "1-sentence recap focusing on the core deal status",
      "objections": ["List specific pushbacks or concerns"],
      "risks": ["List technical or business risks identified"],
      "opportunities": ["List potential upsells, referrals, or expansion signals"],
      "competitors": ["Any competitors or alternatives named"],
      "sentiment": "positive" | "neutral" | "negative"
    }
  `;

  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Groq Extraction Error:", error);
    return {
      summary: "Error analyzing content.",
      objections: [],
      risks: [],
      opportunities: [],
      competitors: [],
      sentiment: "neutral"
    };
  }
};

/**
 * STEP 4, 5, 6 & 10: STRATEGY & TRANSPARENCY ENGINE
 * UPGRADED: High-Precision Mode with Semantic Hindsight & Institutional Learning.
 */
export const generateAdvancedStrategy = async (currentDeal: any, history: any[], patterns: any[]) => {
  const prompt = `
    You are a Senior Deal Strategy Architect with 20 years of experience.
    Your goal is to provide a surgical closing plan using Semantic Hindsight.

    ### STRATEGIC PRIORITIES:
    1. INSTITUTIONAL MEMORY: Prioritize "Global Patterns" from the Hindsight Library. If a pattern worked for another rep, adapt it here.
    2. DATA FIDELITY: You MUST use exact numbers (e.g., "$100k") and exact names (e.g., "AWS") found in the History.
    3. SEMANTIC CORRELATION: Look for conceptual matches between current objections and winning patterns, even if phrasing differs.
    4. BATTLE SCRIPT: The "script" must be a direct response to the most recent objection.

    ### CONTEXT
    CURRENT DEAL: ${currentDeal.name}
    DEAL STAGE: ${currentDeal.stage}

    ### MEMORY LAYER (CHRONOLOGICAL HISTORY)
    ${JSON.stringify(history)}

    ### HINDSIGHT LIBRARY (HISTORICAL WINNING PATTERNS)
    ${JSON.stringify(patterns)}

    ### STRICT JSON OUTPUT FORMAT:
    {
      "summary": "High-stakes 1-sentence recap using specific numbers.",
      "risks": ["Risk involving exact figures/competitors from history"],
      "strategy": "The offensive closing plan (3-4 steps).",
      "learned_insight": "Identify the Global Winning Pattern from the library used and why.",
      "script": "A 3-line high-impact talk track. MUST repeat exact amounts (e.g. $100k) and names (e.g. AWS).",
      "success_probability": number,
      "winning_pattern_used": "Name of the pattern matched from the library",
      "memory_count": ${history.length},
      "similar_deal_count": ${patterns.length},
      "key_influence": "Semantic correlation breakdown (e.g. '94% match on budget risk').",
      "reasoning": "Internal logic regarding omnichannel signals and competitor movements.",
      "used_memories": [
        {
          "interaction_id": "string",
          "source_call": "e.g. Email on 2026-04-12",
          "detected_signal": "Explain the semantic match (e.g. 'Concept: Price Sensitivity matched $150k objection')"
        }
      ]
    }
  `;

  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Strategy Engine Error:", error);
    return {
      summary: "Error generating strategic plan.",
      risks: ["System connectivity issues"],
      strategy: "Manual strategy session required.",
      learned_insight: "Strategy engine offline.",
      success_probability: 50,
      script: "I need to review the history manually before providing a script.",
      memory_count: history.length,
      similar_deal_count: 0,
      key_influence: "System Error",
      reasoning: "API Failure",
      used_memories: []
    };
  }
};

/**
 * NEW: GENERATE FULL SAMPLE DEAL NARRATIVE
 * Creates a 6-part story arc using Omnichannel sources for Demo Mode.
 */
export const generateFullSampleDeal = async (companyName: string) => {
  const prompt = `
    Generate a 6-interaction sales history for a company named "${companyName}".
    Include diverse sources: Call, Email, LinkedIn, and PDF.

    The story arc must follow this exact progression:
    1. Discovery (Call): High initial interest in business automation.
    2. Technical Validation (LinkedIn): CTO mentions a competitor (e.g. AWS or Azure).
    3. Roadblock (Email): Client raises a specific budget objection (e.g. "$120k setup fee").
    4. Sentiment Crisis (Call): Negative shift during negotiation over implementation speed.
    5. Turning Point (PDF Proposal): We present a "Phased ROI Roadmap" to mitigate risks.
    6. Recovery (Call): Positive sentiment returns as we move toward closing.

    Return ONLY a JSON array of objects with these EXACT keys:
    [
      {
        "summary": "Recap of the interaction",
        "transcript": "Brief messy transcript or email snippet",
        "objections": ["List of objections"],
        "risks": ["List of risks"],
        "opportunities": ["List of opportunities"],
        "competitors": ["Mentioned competitors"],
        "sentiment": "positive" | "neutral" | "negative",
        "timestamp": "2026-04-10 10:00 AM",
        "source": "Call" | "Email" | "LinkedIn" | "PDF"
      }
    ]
  `;

  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    });

    const parsed = JSON.parse(response.choices[0].message.content || "[]");
    return Array.isArray(parsed) ? parsed : (parsed.interactions || []);
  } catch (error) {
    console.error("Narrative Generation Error:", error);
    return [];
  }
};

/**
 * STEP 9: SYNTHETIC DATA GENERATOR
 */
export const generateSyntheticTranscript = async (companyName: string) => {
  const prompt = `
    Generate a realistic, messy enterprise sales call transcript for a company named "${companyName}".
    Include a specific business problem, $ figures, and competitors.
    Return ONLY the raw text.
  `;

  const response = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.1-8b-instant",
  });

  return response.choices[0].message.content || "";
};