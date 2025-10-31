import type { Handler } from "@netlify/functions";
import fetch from "node-fetch";

//인터페이스
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

// GPT Chat Completion 응답 타입 (간단히)
interface ChatCompletionResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
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

// ==== 설정 상수 ====
const SUMMARIZE_THRESHOLD = 1000; // 원래 체크하던 임계값 (보류용)
const CHUNK_SIZE = 3500; // chat model에 보낼 청크 크기 (문자 단위)
const FINAL_PROMPT_MAX = 900; // 이미지 API에 보낼 최종 프롬프트 최대 길이
const MODEL = "gpt-4o-mini"; // 사용 모델

// =======================
// 🔹 긴 스토리 요약 함수 (개선됨 — 에러 핸들링 포함)
// =======================
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
        max_tokens: 400, // 안전장치
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("summarizeText - OpenAI error:", res.status, txt);
      // 폴백: 앞부분을 잘라서 반환
      return text.slice(0, 500);
    }

    const data = (await res.json()) as ChatCompletionResponse;
    const summary = data?.choices?.[0]?.message?.content?.trim();
    return summary || text.slice(0, 500);
  } catch (err: any) {
    console.error("summarizeText - Exception:", err);
    return text.slice(0, 500); // 폴백
  }
}

// =======================
// 🔹 긴 텍스트 안전하게 요약/준비 (청크 요약 -> 통합 요약)
// =======================
async function safePreparePrompt(text: string): Promise<{ finalPrompt: string; summary?: string }> {
  // 이미 짧으면 그대로 사용
  if (text.length <= SUMMARIZE_THRESHOLD) {
    const final = text.slice(0, FINAL_PROMPT_MAX);
    return { finalPrompt: final, summary: undefined };
  }

  // 1) 텍스트 청크화
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    chunks.push(text.slice(i, i + CHUNK_SIZE));
  }

  // 2) 각 청크 요약 (병렬로 처리해도 되지만, rate-limit 고려해 순차 처리)
  const chunkSummaries: string[] = [];
  for (const chunk of chunks) {
    // summarizeText 내부에서 실패 시 안전 폴백을 반환함
    const s = await summarizeText(chunk);
    chunkSummaries.push(s);
  }

  // 3) 요약들을 합쳐서 필요하면 재요약
  let combined = chunkSummaries.join(" ");
  if (combined.length > CHUNK_SIZE) {
    // 한 번 더 요약 시도 (더 짧은 결과 기대)
    try {
      combined = await summarizeText(combined);
    } catch (e) {
      // 폴백: 앞부분 잘라서 사용
      combined = combined.slice(0, 1200);
    }
  }

  // finalPrompt는 이미지 API 제한을 고려해 잘라둠
  const finalPrompt = combined.slice(0, FINAL_PROMPT_MAX);

  return { finalPrompt, summary: combined };
}

// =======================
// 🔹 Netlify Handler (수정본)
// =======================
export const handler: Handler = async (event) => {
  if (!event.body)
    return { statusCode: 400, body: JSON.stringify({ error: "No body provided" }) };

  const { description } = JSON.parse(event.body) as ImageRequestBody;

  try {
    // 1️⃣ 입력 텍스트 정제
    const cleanDescription = sanitizeText(description || "");

    // 2️⃣ 안전하게 프롬프트 준비 (요약 포함)
    const { finalPrompt, summary } = await safePreparePrompt(cleanDescription);

    // 로그: 실제 전송되는 프롬프트 길이 확인용
    console.log("Prepared prompt length:", finalPrompt.length);

    // 3️⃣ 이미지 생성 요청 (프롬프트는 짧게 잘라서 보냄)
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

    if (!imageRes.ok) {
      const err = await imageRes.text();
      console.error("OpenAI Image Error:", imageRes.status, err);
      return { statusCode: 500, body: JSON.stringify({ error: `OpenAI Image Error: ${err}` }) };
    }

    const imageDataRaw: any = await imageRes.json();
    const imageUrl = imageDataRaw?.data?.[0]?.url;

    if (!imageUrl) {
      console.error("No image URL in response:", imageDataRaw);
      return { statusCode: 500, body: JSON.stringify({ error: "No image URL returned from OpenAI" }) };
    }

    // ✅ 반환
    const responseBody: ImageResponse = {
      imageUrl,
      summary: summary, // summary가 undefined일 수도 있음
    };

    return { statusCode: 200, body: JSON.stringify(responseBody) };

  } catch (error: any) {
    console.error("Server Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: `Server Error: ${error.message || error}` }) };
  }
};

export default handler;
