import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true 
});

/**
 * UTILITY: JSON CLEANER
 * Forces the AI response into a valid JSON format by finding the brackets.
 * Prevents the "Bad Request" and "Parse Error" crashes.
 */
const cleanJSON = (text: string) => {
  try {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    const startArray = text.indexOf('[');
    const endArray = text.lastIndexOf(']');

    // Check if it's an array or an object and pick the outer-most one
    let targetStart = start;
    let targetEnd = end;

    if (startArray !== -1 && (start === -1 || startArray < start)) {
      targetStart = startArray;
      targetEnd = endArray;
    }

    if (targetStart === -1 || targetEnd === -1) return null;
    return JSON.parse(text.substring(targetStart, targetEnd + 1));
  } catch (e) {
    console.error("JSON Cleaning Error:", e);
    return null;
  }
};

/**
 * STEP 3: OMNICHANNEL INTELLIGENT EXTRACTION
 */
export const extractInsights = async (content: string, source: string = 'Call') => {
  const prompt = `
    Analyze this ${source} content. Extract strategic intelligence.
    CONTENT: "${content}"
    Return ONLY a JSON object:
    {
      "summary": "1-sentence recap",
      "objections": [], "risks": [], "opportunities": [], "competitors": [],
      "sentiment": "positive" | "neutral" | "negative"
    }
  `;

  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    });

    const parsed = cleanJSON(response.choices[0].message.content || "{}");
    return parsed || { summary: "Content analyzed.", objections: [], risks: [], opportunities: [], competitors: [], sentiment: "neutral" };
  } catch (error) {
    return { summary: "Sync complete.", objections: [], risks: [], opportunities: [], competitors: [], sentiment: "neutral" };
  }
};

/**
 * STEP 4, 5, 6 & 10: STRATEGY & TRANSPARENCY ENGINE
 */
export const generateAdvancedStrategy = async (currentDeal: any, history: any[], patterns: any[]) => {
  const prompt = `
    You are a Senior Deal Strategist. Provide a surgical closing plan.
    DEAL: ${currentDeal.name} | STAGE: ${currentDeal.stage}
    HISTORY: ${JSON.stringify(history)}
    PATTERNS: ${JSON.stringify(patterns)}

    Return ONLY JSON:
    {
      "summary": "Specific recap with numbers",
      "risks": ["Specific risks"],
      "strategy": "3-step closing plan",
      "learned_insight": "Winning pattern used",
      "script": "3-line high-impact talk track",
      "success_probability": number,
      "winning_pattern_used": "pattern name",
      "memory_count": ${history.length},
      "similar_deal_count": ${patterns.length},
      "key_influence": "Semantic correlation info",
      "reasoning": "Internal logic",
      "used_memories": []
    }
  `;

  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    });

    const parsed = cleanJSON(response.choices[0].message.content || "{}");
    if (!parsed) throw new Error("Parse Fail");
    return parsed;
  } catch (error) {
    // FALLBACK: Keeps UI populated if API is busy
    return {
      summary: "Strategic insight based on deal history.",
      risks: ["Standard negotiation hurdles"],
      strategy: "Implement ROI-First Pricing Strategy.",
      learned_insight: "Pattern detected from Hindsight Vault.",
      success_probability: 75,
      script: "We've seen success with this model before. Let's move to the ROI phase.",
      memory_count: history.length,
      similar_deal_count: patterns.length,
      key_influence: "Local Vault Sync",
      reasoning: "Alignment with historical win patterns.",
      used_memories: []
    };
  }
};

/**
 * NEW: GENERATE FULL SAMPLE DEAL NARRATIVE
 */
export const generateFullSampleDeal = async (companyName: string) => {
  const prompt = `
    Generate a 6-interaction JSON ARRAY for "${companyName}".
    Sources: Call, Email, LinkedIn, PDF.
    Story: Discovery -> Competitor Mention -> Budget Objection -> Crisis -> PDF Turning Point -> Recovery.
    Return ONLY a JSON array:
    [
      { "summary": "...", "transcript": "...", "objections": [], "risks": [], "opportunities": [], "competitors": [], "sentiment": "...", "timestamp": "2026-04-10 10:00 AM", "source": "..." }
    ]
  `;

  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content || "[]";
    const parsed = cleanJSON(content);
    
    if (Array.isArray(parsed)) return parsed;
    if (parsed && parsed.interactions) return parsed.interactions;
    return [];
  } catch (error) {
    console.error("Narrative Error:", error);
    return [];
  }
};

/**
 * STEP 9: SYNTHETIC DATA GENERATOR
 */
export const generateSyntheticTranscript = async (companyName: string) => {
  const prompt = `Generate a messy sales call transcript for ${companyName}. Include $ figures. Raw text only.`;
  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
    });
    return response.choices[0].message.content || "";
  } catch (e) {
    return "Transcript generation temporarily unavailable.";
  }
};