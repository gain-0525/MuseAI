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
  const [error, setError] = useState("");

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

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>번역하기</h3>
        <p className="description">Please write down the language name you want to translate</p>
        <textarea
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          placeholder="번역할 언어 입력 (예: 한국어 English, 中文, 日本語)"
        />
        <button className="transe-btn" onClick={handleTranslate} disabled={loading || !targetLanguage}>
          {loading ? "번역 중..." : "번역"}
        </button>

        {translation && (
          <div className="translation-result">
            <h4>번역 결과:</h4>
            <p>{translation}</p>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        <button className="close-btn" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default TranslateModal;
