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

    // Prepare the prompt for OpenAI
    const prompt = `The following is part of a financial report. Simplify it into layman's terms.

Content:
${htmlContent}

Summary:`;

    // Call the OpenAI API using gpt-3.5-turbo
    const responseFromAI = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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

    // Extract the summary
    const summary = responseFromAI.choices[0].message.content.trim();

    // Send the summary as the response
    response.json({ summary });
  } catch (error) {
    console.error("Error in getTranslation:", error);
    response.status(500).json({ error: "Failed to translate content", details: error.message });
  }
};
