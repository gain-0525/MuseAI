import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { artifacts, type Artifact } from "../data/artifacts";
import "./MainPage.css";

const MainPage: React.FC = () => {
  const [cards, setCards] = useState<Artifact[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setCards(artifacts);
  }, []);

  // 제목 또는 유물코드 검색 가능
  const filteredCards = cards.filter(
    (card) =>
      card.title.toLowerCase().includes(search.toLowerCase()) ||
      card.artifactCode.toLowerCase().includes(search.toLowerCase())
  );

  const handleCardClick = (id: number) => {
    navigate(`/detail/${id}`);
  };

  return (
    <div className="main-page">
      <h1 className="page-title">전시 작품 목록</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="작품 이름이나 코드(A001 등)를 검색하세요..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card-grid">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            className="card"
            onClick={() => handleCardClick(card.id)}
            style={{ cursor: "pointer" }}
          >
            <div className="card-image">
              <img src={card.imageUrl} alt={card.title} />
            </div>
            <p className="artifact-code">{card.artifactCode}</p>
            <h3>{card.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPage;
