import React, { useState } from "react";
import "./StoryModal.css";

interface StoryModalProps {
  text: string; // artifact.description
  onClose: () => void;
}

export default function StoryModal({ text, onClose }: StoryModalProps) {
  const [language, setLanguage] = useState("");
  const [storyData, setStoryData] = useState<string>("");
  const [imageData, setImageData] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!language.trim()) return alert("번역할 언어를 입력하세요!");
    setLoading(true);

    try {
      // 1️⃣ 스토리 생성
      const storyRes = await fetch("/.netlify/functions/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language }),
      });
      const storyJson: { story?: string; error?: string } = await storyRes.json();
      if (storyJson.error) return alert(storyJson.error);
      setStoryData(storyJson.story!);

      // 2️⃣ 이미지 생성
      const imgRes = await fetch("/.netlify/functions/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: storyJson.story }),
      });
      const imgJson: { imageUrl?: string; error?: string } = await imgRes.json();
      if (imgJson.error) return alert(imgJson.error);
      setImageData(imgJson.imageUrl!);

    } catch (err) {
      console.error("생성 중 오류:", err);
      alert("생성 중 오류가 발생했습니다.");
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
          <button onClick={handleGenerate} disabled={loading}>
            {loading ? "생성 중..." : "스토리 & 이미지 만들기"}
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

