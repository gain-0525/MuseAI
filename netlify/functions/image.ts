import type { Handler } from "@netlify/functions";
import fetch from "node-fetch";

// 인터페이스
interface ImageRequestBody {
  description: string; // story 내용
}

interface ImageResponse {
  imageUrl: string | null;
  summary?: string;
  warning?: string;
}

interface ChatCompletionResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface OpenAIImageResponse {
  data: { url: string }[];
}

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

// 설정 상수
const SUMMARIZE_THRESHOLD = 1000;
const CHUNK_SIZE = 3500;
const FINAL_PROMPT_MAX = 900;
const MODEL = "gpt-4o-mini";

// 긴 스토리 요약 함수
async function summarizeText(text: string): Promise<string> {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that summarizes long children's stories in a kind and simple tone.",
          },
          {
            role: "user",
            content: `Summarize this story in one short paragraph under 500 characters:\n\n${text}`,
          },
        ],
        max_tokens: 400,
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("summarizeText - OpenAI error:", res.status, txt);
      return text.slice(0, 500);
    }

    const data = (await res.json()) as ChatCompletionResponse;
    const summary = data?.choices?.[0]?.message?.content?.trim();
    return summary || text.slice(0, 500);
  } catch (err: unknown) {
    console.error("summarizeText - Exception:", err);
    return text.slice(0, 500);
  }
}

// 긴 텍스트 안전하게 요약/준비
async function safePreparePrompt(
  text: string
): Promise<{ finalPrompt: string; summary?: string }> {
  if (text.length <= SUMMARIZE_THRESHOLD) {
    const final = text.slice(0, FINAL_PROMPT_MAX);
    return { finalPrompt: final, summary: undefined };
  }

  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    chunks.push(text.slice(i, i + CHUNK_SIZE));
  }

  const chunkSummaries: string[] = [];
  for (const chunk of chunks) {
    const s = await summarizeText(chunk);
    chunkSummaries.push(s);
  }

  let combined = chunkSummaries.join(" ");
  if (combined.length > CHUNK_SIZE) {
    try {
      combined = await summarizeText(combined);
    } catch {
      combined = combined.slice(0, 1200);
    }
  }

  const finalPrompt = combined.slice(0, FINAL_PROMPT_MAX);
  return { finalPrompt, summary: combined };
}

// Netlify Handler
export const handler: Handler = async (event) => {
  if (!event.body) {
    return { statusCode: 400, body: JSON.stringify({ error: "No body provided" }) };
  }

  const { description } = JSON.parse(event.body) as ImageRequestBody;

  try {
    const cleanDescription = sanitizeText(description || "");
    const { finalPrompt, summary } = await safePreparePrompt(cleanDescription);

    console.log("Prepared prompt length:", finalPrompt.length);

    // 이미지 생성 시도
    let imageUrl: string | null = null;
    let warning: string | undefined = undefined;

    try {
      const imageRes = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: `Create a cute, child-friendly illustration based on this story: "${finalPrompt}"`,
          size: "256x256",
        }),
      });

      const imageDataRawUnknown: unknown = await imageRes.json();

      if (!imageRes.ok) {
        console.error(
          "OpenAI Image Error:",
          imageRes.status,
          typeof imageDataRawUnknown === "object" ? JSON.stringify(imageDataRawUnknown) : imageDataRawUnknown
        );
        warning = "The image could not be generated due to content policy restrictions.";
      } else {
        // 안전하게 타입 체크
        if (
          typeof imageDataRawUnknown === "object" &&
          imageDataRawUnknown !== null &&
          "data" in imageDataRawUnknown &&
          Array.isArray((imageDataRawUnknown as any).data)
        ) {
          const imageDataRaw = imageDataRawUnknown as OpenAIImageResponse;
          imageUrl = imageDataRaw?.data?.[0]?.url || null;
          if (!imageUrl) {
            warning = "The image could not be generated, but the summary is available.";
          }
        } else {
          warning = "The image could not be generated due to unexpected response structure.";
        }
      }
    } catch (imgErr: unknown) {
      console.error("Image generation exception:", imgErr);
      warning = "The image could not be generated due to an unexpected error.";
    }

    const responseBody: ImageResponse = {
      imageUrl,
      summary,
      warning,
    };

    return { statusCode: 200, body: JSON.stringify(responseBody) };
  } catch (error: unknown) {
    console.error("Server Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Server Error: ${error instanceof Error ? error.message : String(error)}`,
      }),
    };
  }
};

export default handler;
