import type { Handler } from "@netlify/functions";
import fetch from "node-fetch";

interface RequestBody {
  text: string;
}

export const handler: Handler = async (event) => {
  if (!event.body) {
    return { statusCode: 400, body: "Request body is missing" };
  }

  const { text } = JSON.parse(event.body) as RequestBody;

  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is missing");
    return { statusCode: 500, body: "OPENAI_API_KEY is missing" };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "alloy",
        input: text,
        format: "mp3", // mp3 형식
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI TTS API Error:", errorText);
      return { statusCode: 500, body: errorText };
    }

    // binary 데이터를 그대로 반환
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return {
      statusCode: 200,
      headers: { "Content-Type": "audio/mpeg" },
      body: buffer.toString("base64"), // 브라우저에서 fetch.arrayBuffer()로 디코딩 가능
      isBase64Encoded: true,
    };
  } catch (err: any) {
    console.error("Fetch error:", err);
    return { statusCode: 500, body: err.message || "Unknown error" };
  }
};

export default handler;

