import React from "react";
import "./Guide.css";

const GuidePage: React.FC = () => {
  return (
    <div className="guide-page">
      <h1 className="page-title">MuseAI 사용 가이드</h1>

      <section className="guide-section">
        <h2>1. 작품 검색</h2>
        <p>
          검색창에 작품 이름이나 유물 코드를 입력하여 원하는 작품을
          빠르게 찾을 수 있습니다.
        </p>
      </section>

      <section className="guide-section">
        <h2>2. 작품 상세 확인</h2>
        <p>
          작품을 클릭하면 상세 페이지에서 이미지, 설명, 국가, 출토지 등
          모든 정보를 확인할 수 있습니다.
        </p>
      </section>

      <section className="guide-section">
        <h2>3. 번역 기능</h2>
        <p>
          작품 설명을 다른 언어로 번역할 수 있습니다. 번역 버튼을 눌러
          팝업창에서 결과를 확인하세요.
        </p>
      </section>

      <section className="guide-section">
        <h2>4. 스토리 만들기</h2>
        <p>
          스토리 만들기 버튼을 통해 작품의 이야기나 AI 생성 스토리를 작성하고
          확인할 수 있습니다.
        </p>
      </section>

      <section className="guide-section">
        <h2>5. 반응형 지원</h2>
        <p>
          MuseAI는 데스크탑, 패드, 모바일 화면에서도 최적화되어 모든 화면에서
          편리하게 이용할 수 있습니다.
        </p>
      </section>

      <section className="guide-section">
        <h2>6. 주의사항 </h2>
        <p>스토리스토리설명을 기반으로 ai가 생성하는 것입니다.
          제작한 스토리 기반으로 그림을 생게 됩니다. 
          이 때, AI 생성 기준 부적합 할 시 그림으로 제작되지 않으며 에러가 발생하니 유의 바랍니다.
        </p>
      </section>
    </div>
  );
};

export default GuidePage;
