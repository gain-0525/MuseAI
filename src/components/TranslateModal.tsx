import React, { useState } from "react";
import "./TranslateModal.css";

interface TranslateModalProps {
  text: string;
  onClose: () => void;
}

const TranslateModal: React.FC<TranslateModalProps> = ({ text, onClose }) => {
  const [targetLanguage, setTargetLanguage] = useState("");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [error, setError] = useState("");
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null);

  // 번역 요청
  const handleTranslate = async () => {
    setLoading(true);
    setError("");
    setTranslation("");

    try {
      const res = await fetch("/.netlify/functions/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLanguage }),
      });

      const data = await res.json();
      setTranslation(data.translation);
    } catch (err) {
      console.error(err);
      setError("번역 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  // TTS 요청 및 AudioContext 재생
  const handleTTS = async () => {
    if (!translation) return;
    setTtsLoading(true);

    try {
      // 기존 재생 중이면 멈춤
      if (audioSource) {
        audioSource.stop();
      }

      // 새 AudioContext 생성
      const ctx = audioContext || new AudioContext();
      setAudioContext(ctx);

      const res = await fetch("/.netlify/functions/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: translation }),
      });

      if (!res.ok) throw new Error("TTS 요청 실패");

      const arrayBuffer = await res.arrayBuffer();

      // 브라우저에서 디코딩
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start();

      setAudioSource(source);
    } catch (err) {
      console.error(err);
      alert("음성 생성 중 오류 발생");
    } finally {
      setTtsLoading(false);
    }
  };

  // 모달 닫기 시 재생 정지
  const handleClose = () => {
    if (audioSource) {
      audioSource.stop();
      setAudioSource(null);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>번역하기</h3>
        <p className="description">
          번역을 원하는 언어명을 해당 언어로 적어주세요. <br />
          Please write down the language name you want to translate.
        </p>

        <textarea
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          placeholder="번역할 언어 입력 (예: 한국어, English, 中文, 日本語)"
        />

        <button
          className="transe-btn"
          onClick={handleTranslate}
          disabled={loading || !targetLanguage}
        >
          {loading ? "번역 중..." : "번역"}
        </button>

        {translation && (
          <div className="translation-result">
            <h4>번역 결과:</h4>
            <p>{translation}</p>
            <button
              className="tts-btn"
              onClick={handleTTS}
              disabled={ttsLoading}
            >
              {ttsLoading ? "음성 생성 중..." : "🔊 음성으로 듣기"}
            </button>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        <button className="close-btn" onClick={handleClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default TranslateModal;

