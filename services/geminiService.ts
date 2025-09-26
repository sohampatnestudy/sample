
import { GoogleGenAI, Type } from "@google/genai";

// TODO: Ensure the API_KEY is set in your environment variables.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

/**
 * Summarizes an article using the Gemini API.
 * @param {string} articleText - The text of the article to summarize.
 * @returns {Promise<string>} - A two-line summary of the article.
 * 
 * JEST-like test stub:
 * test('summarizeArticle should return a summary string', async () => {
 *   const summary = await summarizeArticle('This is a long article text...');
 *   expect(typeof summary).toBe('string');
 *   expect(summary.split('\n').length).toBeLessThanOrEqual(2);
 * });
 */
export const summarizeArticle = async (articleText: string): Promise<string> => {
  if (!API_KEY) return "API Key not configured. Summary feature is disabled.";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize the following article for an IIT-JEE student in two concise lines:\n\n${articleText}`,
    });
    return response.text;
  } catch (error) {
    console.error("Error summarizing article:", error);
    return "Could not generate summary. Please try again later.";
  }
};


export interface QuestionClassification {
    subject: string;
    topic: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    suggestions: string[];
}

/**
 * Classifies a question using the Gemini API.
 * @param {string} questionText - The text of the question to classify.
 * @returns {Promise<QuestionClassification | string>} - An object with classification details or an error string.
 *
 * JEST-like test stub:
 * test('classifyQuestion should return a structured classification object', async () => {
 *   const result = await classifyQuestion('Find the integral of x^2 dx.');
 *   if (typeof result !== 'string') {
 *     expect(result.subject).toBe('Mathematics');
 *     expect(result.topic).toBeDefined();
 *     expect(['Easy', 'Medium', 'Hard']).toContain(result.difficulty);
 *     expect(Array.isArray(result.suggestions)).toBe(true);
 *   }
 * });
 */
export const classifyQuestion = async (questionText: string): Promise<QuestionClassification | string> => {
    if (!API_KEY) return "API Key not configured. Quick Checker feature is disabled.";
    
    const schema = {
        type: Type.OBJECT,
        properties: {
            subject: { type: Type.STRING, description: "Physics, Chemistry, or Mathematics" },
            topic: { type: Type.STRING, description: "The specific chapter or topic name" },
            difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
            suggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "1-2 initial steps or key concepts to apply for solving."
            }
        },
        required: ["subject", "topic", "difficulty", "suggestions"]
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze the following IIT-JEE level question. Identify the primary subject (Physics, Chemistry, or Mathematics), the specific topic/chapter it belongs to, its difficulty level (Easy, Medium, Hard), and suggest 1-2 initial steps or concepts to apply for solving it. Do not provide the full solution.\n\nQuestion:\n${questionText}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as QuestionClassification;
    } catch (error) {
        console.error("Error classifying question:", error);
        return "Failed to analyze the question. It might be too complex or malformed. Please try again.";
    }
};
