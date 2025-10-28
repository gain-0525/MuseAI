import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { artifacts, type Artifact } from "../data/artifacts";
import "./DetailPage.css";

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artifact, setArtifact] = useState<Artifact | null>(null);
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

      <img
        src={artifact.imageUrl}
        alt={artifact.title}
        className="artifact-image"
      />

      {/* 🔹 새로 추가된 부분: location과 nation */}
      <div className="artifact-info">
        {artifact.nation && <p><strong>국가:</strong> {artifact.nation}</p>}
        {artifact.location && <p><strong>출토지 / 소장처:</strong> {artifact.location}</p>}
      </div>

      <p className="artifact-description">{artifact.description}</p>
    </div>
  );
};

export default DetailPage;
