import type { Handler } from "@netlify/functions";
import fetch from "node-fetch";

// =======================
// 🔹 인터페이스 정의
// =======================
interface ImageRequestBody {
  description: string; // story 내용
}

interface ImageResponse {
  imageUrl: string;
  summary?: string;
}

interface ErrorResponse {
  error: string;
}

// GPT Chat Completion 응답 타입
interface ChatCompletionResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

// =======================
// 🔹 안전 필터링용 단어 목록
// =======================
const forbiddenWords = ["폭력", "총", "죽음", "살인", "성적", "음란", "테러"];

// 금지 단어 제거 함수
function sanitizeText(text: string): string {
  let sanitized = text;
  forbiddenWords.forEach((word) => {
    const regex = new RegExp(word, "gi");
    sanitized = sanitized.replace(regex, "");
  });
  return sanitized;
}

// =======================
// 🔹 긴 스토리 요약 함수
// =======================
async function summarizeText(text: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes long children's stories in a kind and simple tone.",
        },
        {
          role: "user",
          content: `Summarize this story in one short paragraph under 500 characters: ${text}`,
        },
      ],
    }),
  });

  const data = (await res.json()) as ChatCompletionResponse;
  const summary = data?.choices?.[0]?.message?.content?.trim();
  return summary || text.slice(0, 500);
}

// =======================
// 🔹 Netlify Handler
// =======================
export const handler: Handler = async (event) => {
  if (!event.body)
    return { statusCode: 400, body: JSON.stringify({ error: "No body provided" }) };

  const { description } = JSON.parse(event.body) as ImageRequestBody;

  try {
    // 1️⃣ 입력 텍스트 정제
    const cleanDescription = sanitizeText(description);

    // 2️⃣ 긴 내용이면 요약
    const promptText =
      cleanDescription.length > 1000
        ? await summarizeText(cleanDescription)
        : cleanDescription;

    // 3️⃣ 이미지 생성 요청
    const imageRes = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: `Create a cute, child-friendly illustration based on this story: "${promptText}"`,
        size: "256x256",
      }),
    });

    if (!imageRes.ok) {
      const err = await imageRes.text();
      console.error("OpenAI Image Error:", err);
      return { statusCode: 500, body: JSON.stringify({ error: `OpenAI Image Error: ${err}` }) };
    }

    const imageDataRaw: any = await imageRes.json();
    const imageUrl = imageDataRaw?.data?.[0]?.url;

    if (!imageUrl) {
      return { statusCode: 500, body: JSON.stringify({ error: "No image URL returned from OpenAI" }) };
    }

    // ✅ 4️⃣ 요약 결과와 이미지 URL 함께 반환
    const responseBody: ImageResponse = {
      imageUrl,
      summary: cleanDescription.length > 1000 ? promptText : undefined,
    };

    return { statusCode: 200, body: JSON.stringify(responseBody) };

  } catch (error: any) {
    console.error("Server Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: `Server Error: ${error.message || error}` }) };
  }
};

export default handler;
