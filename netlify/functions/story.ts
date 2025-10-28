import type { Handler } from "@netlify/functions";
import fetch from "node-fetch";

interface RequestBody {
  text: string;     // artifact.description
  language: string; // 입력받은 언어
}

interface OpenAIChatResponse {
  choices: { message: { content: string } }[];
}

interface StoryResponse {
  story: string;
  imageUrl: string;
}

export const handler: Handler = async (event) => {
  if (!event.body) return { statusCode: 400, body: "No body provided" };

  const { text, language } = JSON.parse(event.body) as RequestBody;

  try {
    // 1. 이야기 생성
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
      const err = await storyRes.text();
      return { statusCode: 500, body: `OpenAI Chat Error: ${err}` };
    }

    const storyDataRaw: unknown = await storyRes.json();
    const storyData = storyDataRaw as OpenAIChatResponse;
    const story = storyData.choices[0].message.content;

    // 2. 이미지 생성
    const imageRes = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: `Illustrate this story for children: "${story}"`,
        size: "256x256",
      }),
    });

    if (!imageRes.ok) {
      const err = await imageRes.text();
      return { statusCode: 500, body: `OpenAI Image Error: ${err}` };
    }

    const imageDataRaw: unknown = await imageRes.json();
    const imageData = (imageDataRaw as any).data[0].url;

    const response: StoryResponse = { story, imageUrl: imageData };
    return { statusCode: 200, body: JSON.stringify(response) };
  } catch (error) {
    return { statusCode: 500, body: `Server Error: ${error}` };
  }
};

export default handler;
