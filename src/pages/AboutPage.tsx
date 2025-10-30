import React from "react";
import "./AboutPage.css";

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <h1 className="page-title">MuseAI란?</h1>

      <section className="about-section">
        <h2>배경</h2>
        <p>
          국립중앙박물관은 세계 주요 박물관에 비해 외국인 관람객의 비율이 낮습니다.
          제가 실제로 여러 해외 주요 박물관들을 방문해본 결과, 그곳들은 외국인 관광객들로 붐비며 하나의 대표적인 관광 명소로 자리 잡고 있었습니다.
          MuseAI는 이러한 차이를 해소하고, 더 많은 외국인들이 한국의 유물을 쉽고 흥미롭게 이해할 수 있도록 개발되었습니다.
          특히 최근 중국인 무비자 입국 제도로 인해 중국인 관광객이 급증하고 있는 만큼, 이들이 한국 문화를 더욱 깊이 체험할 수 있는 계기를 마련하고자 합니다.
        </p>
      </section>

      <section className="about-section">
        <h2>목적</h2>
        <p>
          MuseAI는 인공지능 기반 번역과 스토리 생성 기능을 통해 유물 정보를
          다양한 언어로 제공하고, 방문객의 이해를 돕는 디지털 가이드 역할을 합니다.
        </p>
      </section>

      <section className="about-section">
        <h2>주요 기능</h2>
        <ul>
          <li>작품 검색: 작품 이름이나 코드로 빠르게 검색 가능</li>
          <li>상세 정보 확인: 이미지, 설명, 출토지, 국가 등 제공</li>
          <li>번역 기능: 작품 설명을 다국어로 번역</li>
          <li>스토리 생성: 작품 기반 AI 스토리 작성</li>
          <li>반응형 지원: 데스크탑, 패드, 모바일 모두 최적화</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>기대 효과</h2>
        <p>
          외국인 관람객들이 박물관을 더 쉽고 재미있게 이해할 수 있으며,
          MuseAI를 통해 문화유산의 가치를 글로벌하게 확산할 수 있습니다.
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
