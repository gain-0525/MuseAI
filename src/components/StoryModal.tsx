import React, { useState } from "react";
import "./StoryModal.css";

interface StoryModalProps {
  text: string; // artifact.description
  onClose: () => void;
}

interface StoryResponse {
  story: string;
  imageUrl: string;
}

export default function StoryModal({ text, onClose }: StoryModalProps) {
  const [language, setLanguage] = useState("");
  const [storyData, setStoryData] = useState<string>("");
  const [imageData, setImageData] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleGenerateStory = async () => {
    if (!language.trim()) return alert("번역할 언어를 입력하세요!");
    setLoading(true);

    try {
      const res = await fetch("/.netlify/functions/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language }),
      });

      const data: StoryResponse = await res.json();
      setStoryData(data.story);
      setImageData(data.imageUrl);
    } catch (error) {
      console.error("스토리 생성 중 오류:", error);
      alert("스토리 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="story-modal-overlay">
      <div className="story-modal">
        <h2>AI 동화 생성기 📖</h2>

        <input
          type="text"
          placeholder="번역할 언어를 입력하세요"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />

        <div className="modal-buttons">
          <button onClick={onClose}>닫기</button>
          <button onClick={handleGenerateStory} disabled={loading}>
            {loading ? "생성 중..." : "스토리 만들기"}
          </button>
        </div>

        {storyData && (
          <div className="story-result">
            <h3>📚 생성된 스토리</h3>
            <pre>{storyData}</pre>
          </div>
        )}

        {imageData && (
          <div className="story-image">
            <img src={imageData} alt="Generated Story" />
          </div>
        )}
      </div>
    </div>
  );
}
