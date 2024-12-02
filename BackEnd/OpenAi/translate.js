import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is set in your environment variables
});

export const getTranslation = async (request, response) => {
  try {
    const { htmlContent } = request.body;

    if (!htmlContent) {
      return response.status(400).json({ error: "HTML content is required" });
    }

    const prompt = `The following is a section from a financial report. Your task is to:
1. Extract key metrics related to the stock's performance (e.g., revenue, profit, EPS).
2. Simplify any technical terms into plain language.
3. Highlight performance insights (e.g., growth trends, risks, or strengths).
4. Identify hidden or less obvious insights valuable to investors.
5. Summarize the stock's performance, including opportunities and risks.
6. Decide if the stock is bullish, or bearish.

Content:
${htmlContent}

Summary:`;

    const responseFromAI = await openai.chat.completions.create({
      model: "gpt-3.5",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that simplifies financial reports.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const summary = responseFromAI.choices[0].message.content.trim();

    response.json({ summary });
  } catch (error) {
    console.error("Error in getTranslation:", error);
    response.status(500).json({ error: "Failed to translate content", details: error.message });
  }
};
