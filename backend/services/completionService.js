/**
 * completionService.js (Gemini + fallback)
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY missing");
  }

  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

function buildFallbackAnswer(question, chunks) {
  const text = chunks.map((c) => c.content).join("\n\n");

  // Basit demo fallback: ilk 2-3 anlamlı cümleyi döndür
  const sentences = text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
    .slice(0, 3);

  return `⚠️ ⚠️ AI temporarily unavailable. Displaying document-based response.\n\n${sentences.join(" ")}`;
}

async function generateAnswer(question, chunks) {
  try {
    const genAI = getClient();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const context = chunks.map((c) => c.content).join("\n\n");

    const prompt = `
You are an AI assistant.
Answer ONLY based on the context below.
If the answer is not in the context, say so briefly.

Context:
${context}

Question:
${question}

Answer:
`;

    const result = await model.generateContent(prompt);
    const response = result.response;

    return response.text();
  } catch (err) {
    console.error("Gemini error:", err.message);
    return buildFallbackAnswer(question, chunks);
  }
}

module.exports = { generateAnswer };