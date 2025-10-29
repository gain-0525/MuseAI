import type { Handler } from "@netlify/functions";
import fetch from "node-fetch";

interface RequestBody {
  text: string;     // artifact.description
  language: string; // 번역할 언어
}

interface OpenAIChatResponse {
  choices: { message: { content: string } }[];
}

interface StoryResponse {
  story: string;
}

interface ErrorResponse {
  error: string;
}

export const handler: Handler = async (event) => {
  if (!event.body) {
    return { statusCode: 400, body: JSON.stringify({ error: "No body provided" }) };
  }

  let parsedBody: RequestBody;
  try {
    parsedBody = JSON.parse(event.body) as RequestBody;
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON body" }) };
  }

  const { text, language } = parsedBody;

  try {
    const storyRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Create a short children's story based on this text: "${text}" and translate it into ${language}.`,
          },
        ],
      }),
    });

    if (!storyRes.ok) {
      const errText = await storyRes.text();
      console.error("OpenAI Chat Error:", errText);
      return { statusCode: 500, body: JSON.stringify({ error: `OpenAI Chat Error: ${errText}` }) };
    }

    const storyDataRaw: unknown = await storyRes.json();
    const storyData = storyDataRaw as OpenAIChatResponse;
    const story = storyData.choices?.[0]?.message?.content;

    if (!story) {
      return { statusCode: 500, body: JSON.stringify({ error: "No story returned from OpenAI" }) };
    }

    return { statusCode: 200, body: JSON.stringify({ story }) };

  } catch (error: any) {
    console.error("Server Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: `Server Error: ${error.message || error}` }) };
  }
};

export default handler;
