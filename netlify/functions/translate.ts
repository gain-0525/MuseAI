import type { Handler } from "@netlify/functions";
import fetch from "node-fetch";

interface RequestBody {
  text: string;
  targetLanguage: string;
}

interface OpenAIResponse {
  choices: { message: { content: string } }[];
}

export const handler: Handler = async (event) => {
  if (!event.body) {
    return { statusCode: 400, body: JSON.stringify({ error: "Request body is missing" }) };
  }

  const { text, targetLanguage } = JSON.parse(event.body) as RequestBody;

  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is missing");
    return { statusCode: 500, body: JSON.stringify({ error: "OPENAI_API_KEY is missing" }) };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: `Translate the following text into ${targetLanguage}: ${text}` },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API Error:", errorText);
      return { statusCode: 500, body: JSON.stringify({ error: errorText }) };
    }

    const data = (await response.json()) as OpenAIResponse;

    return { statusCode: 200, body: JSON.stringify({ translation: data.choices[0].message.content }) };
  } catch (err: any) {
    console.error("Fetch error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message || "Unknown error" }) };
  }
};
export default handler;