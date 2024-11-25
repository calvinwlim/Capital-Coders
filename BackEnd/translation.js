import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({
  apiKey: "key",
});

const financialReport = JSON.parse(fs.readFileSync("./financial_report.json", "utf8"));

async function summarizeReport(report) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a financial expert and investor helping beginners learn more about stocks and finance through analyzing different companies' financial reports.",
        },
        {
          role: "user",
          content: `This financial report is in json format: ${JSON.stringify(report)}. Can you translate it into a shorter, simplified, easy-to-read version, roughly two to three paragraphs long, that is catered towards beginner investors and people with an entry-level knowledge of finance please.`,
        },
      ],
    });

    const summary = completion.choices[0].message.content;
    console.log("Summary of the financial report: ", summary);
    return summary;
  } catch (error) {
    console.error("Error summarizing the report: ", error);
  }
}

summarizeReport(financialReport);
