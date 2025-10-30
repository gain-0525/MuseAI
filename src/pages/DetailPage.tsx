import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { artifacts, type Artifact } from "../data/artifacts";
import TranslateModal from "../components/TranslateModal";
import StoryModal from "../components/StoryModal";
import "./DetailPage.css";

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [isTranslateOpen, setIsTranslateOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const artifactId = Number(id);
    const foundArtifact = artifacts.find(item => item.id === artifactId);
    setArtifact(foundArtifact || null);
  }, [id]);

  if (!artifact) {
    return (
      <div className="detail-page">
        <p>유물을 찾을 수 없습니다.</p>
        <button onClick={() => navigate(-1)}>뒤로가기</button>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>뒤로가기</button>

      <h2>{artifact.title}</h2>
      <p className="artifact-code">고유번호: {artifact.artifactCode}</p>
      <img src={artifact.imageUrl} alt={artifact.title} className="artifact-image" />

      <div className="artifact-info">
        {artifact.nation && <p><strong>국가:</strong> {artifact.nation}</p>}
        {artifact.location && <p><strong>출토지 / 소장처:</strong> {artifact.location}</p>}
      </div>

      <p className="artifact-description">{artifact.description}</p>

      {/* 버튼 그룹 */}
      <div style={{ display: "flex", gap: "10px", marginTop: "15px", justifyContent: "center" }}>
        <button className = "translate-btn" onClick={() => setIsTranslateOpen(true)}>번역 translate</button>
        <button className="story-btn" onClick={() => setIsStoryOpen(true)}>스토리 story</button>
      </div>

      {/* TranslateModal */}
      {isTranslateOpen && (
        <TranslateModal
          text={artifact.description}
          onClose={() => setIsTranslateOpen(false)}
        />
      )}

      {/* StoryModal */}
      {isStoryOpen && (
        <StoryModal
          text={artifact.description}
          onClose={() => setIsStoryOpen(false)}
        />
      )}
    </div>
  );
};

export default DetailPage;


