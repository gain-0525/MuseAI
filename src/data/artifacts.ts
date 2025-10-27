// src/data/artifacts.ts
export interface Artifact {
  id: number;
  artifactCode: string; // ✅ 유물 고유번호
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  nation: string;

}

export const artifacts: Artifact[] = [
  {
    id: 1,
    artifactCode: "A001",
    title: "주먹도끼",
    location: "선사고대관",
    nation: "한국-구석기",
    description: "주먹도끼는 끝부분이 뾰족한 타원형 석기로, 뭉툭한 부분을 손으로 쥐고 여러 용도로 사용했던 구석기시대 도구입니다.돌의 한쪽을 떼어 낸 뒤 반대편을 다시 떼어 내 지그재그 모양의 양면 날을 만들었습니다. 구석기인들은 미리 전체적인 모양을 생각하고 계획을 세워 원하는 형태의 주먹도끼를 제작했습니다. 주먹도끼는 서유럽, 중동, 아프리카, 영국, 인도, 동아시아에 이르는 넓은 지역에서 발견되며, 대략 170만 년 전부터 10만 년 전까지 사용되었습니다. 주먹도끼를 만든 고인류는 호모 에렉투스(Homo erectus)로 알려져 있습니다. 이 주먹도끼는 연천 전곡리에서 출토된 것입니다.",
    imageUrl: "https://www.museum.go.kr/uploadfile/ecms/media/2019/12/8B055B02-7295-23FD-19FD-8136FAEF1A7D_thumb.jpg",
  },
  {
    id: 2,
    artifactCode: "A002",
    title: "빗살무늬 토기",
    description: "덧무늬토기 이후에 등장한 것으로, 우리나라 신석기시대를 대표하는 유물이다. 점과 선으로 이루어진 여러 기하학적 무늬는 자연을 배경으로 살아간 당시 사람들의 세계관을 상징적으로 표현한 것으로 여겨진다. 이 토기는 서울시 암사동 집터유적에서 출토된 것으로 겉면을 삼등분하고 각각 다른 무늬로 장식하였다. 토기 아래쪽에 뚫린 두 개의 구멍은 깨진 토기를 임시로 수리하여 사용했던 흔적으로 추정된다. 이를 통해 당시의 토기는 누구나 만들 수 있었던 것이 아니라 만드는 기술자가 따로 있었을 거라는 추측을 할 수 있다.",
    location: "선사고대관",
    nation: "한국-신석기",
    imageUrl: "https://www.museum.go.kr/relic_image/PS01001001/ssu000/2024/1220165016025/700/ssu022891-000-90000.jpg",
  },
  {
    id: 3,
    artifactCode: "A003",
    title: "농경문 청동기",
    location: "선사고대관",
    nation: "한국-초기철기",
    description: "대전에서 출토되었다고 전해지는 농경문 청동기(農耕文 靑銅器)로 윗부분만 남아있다. 농경문 청동기에 그려져 있는 그림을 통해 농경과 관련된 제사를 지낼 때 사용되었던 의식용(儀式用) 도구로 여겨진다.농경문 청동기로 불리고 있으나 그 형태상 방패형 동기(防牌刑 銅器)의 일종으로 볼 수 있다. 몸체 가장 윗부분에는 작은 네모난 구멍 여섯 개가 배치되어 있는데 구멍마다 조금씩 닳아 있어 끈으로 매달아 사용했던 것으로 보인다. 양쪽 면에는 정가운데 세로 방향과 가장자리 윤곽을 따라 빗금, 선, 점선을 이용한 무늬띠가 돌아가고 그 안쪽 빈 공간에 그림이 그려져 있다. 한쪽 면 오른쪽에는 머리 위에 긴 깃털 같은 것을 꽂은 채 따비로 밭을 일구는 남자와 괭이를 치켜든 인물이 있고 왼쪽에는 항아리에 무언가를 담고 있는 인물이 새겨져 있다. 다른 한쪽 면에는 오른쪽과 왼쪽 모두 두 갈래로 갈라진 나무 끝에 새가 한 마리씩 앉아 있는 모습이 묘사되어 있다. 또한 새끼모양의 둥근 고리가 끼워져 있는 꼭지[?]가 한 개 달려있다.농경문 청동기는 인물, 농기구, 경작지 등을 추상적인 선으로 묘사해 청동기시대의 농경과 농경 관련 의례의 실상을 구체적으로 보여주고 있다는 점에서 귀중한 유물이다.",
    imageUrl: "https://www.museum.go.kr/uploadfile/ecms/media/2020/03/E2D7A5F2-2ADF-CBDF-70E5-F2D64EAF4C1B_thumb.jpg",
  },
  {
    id: 4,
    artifactCode: "A004",
    title: "청동거울",
    description: "고조선 시기의 청동제 거울로 문양이 정교하다.",
    imageUrl: "https://via.placeholder.com/300x200?text=Artifact+4",
  },
  {
    id: 5,
    artifactCode: "A005",
    title: "훈민정음 해례본",
    description: "세종대왕이 창제한 훈민정음의 원본 해설서.",
    imageUrl: "https://via.placeholder.com/300x200?text=Artifact+5",
  },
  {
    id: 6,
    artifactCode: "A006",
    title: "조선 왕조실록",
    description: "조선시대 역사를 기록한 실록으로, 세계기록유산이다.",
    imageUrl: "https://via.placeholder.com/300x200?text=Artifact+6",
  },
  {
    id: 7,
    artifactCode: "A007",
    title: "고려청자 인화문 병",
    description: "고려시대 인화기법으로 장식된 청자 병.",
    imageUrl: "https://via.placeholder.com/300x200?text=Artifact+7",
  },
  {
    id: 8,
    artifactCode: "A008",
    title: "금관",
    description: "신라 황금 왕관으로, 경주 금관총에서 출토되었다.",
    imageUrl: "https://via.placeholder.com/300x200?text=Artifact+8",
  },
  {
    id: 9,
    artifactCode: "A009",
    title: "반가사유상",
    description: "고대 불상의 전형적인 사유상 형태.",
    imageUrl: "https://via.placeholder.com/300x200?text=Artifact+9",
  },
  {
    id: 10,
    artifactCode: "A010",
    title: "고려 불화",
    description: "고려시대의 정교한 채색 불화.",
    imageUrl: "https://via.placeholder.com/300x200?text=Artifact+10",
  },
  {
    id: 11,
    artifactCode: "A011",
    title: "백제 금동대향로",
    description: "백제의 예술적 정점을 보여주는 금동 향로.",
    imageUrl: "https://via.placeholder.com/300x200?text=Artifact+11",
  },
  {
    id: 12,
    artifactCode: "A012",
    title: "통일신라 금석문",
    description: "통일신라시대에 새겨진 비석의 일부.",
    imageUrl: "https://via.placeholder.com/300x200?text=Artifact+12",
  },
  {
    id: 13,
    artifactCode: "A013",
    title: "청동검",
    description: "고조선 시대 청동기 무기.",
    imageUrl: "https://via.placeholder.com/300x200?text=Artifact+13",
  },
  {
    id: 14,
    artifactCode: "A014",
    title: "고려 상감청자 접시",
    description: "청자 표면에 상감 무늬가 새겨진 고려시대 접시.",
    imageUrl: "https://via.placeholder.com/300x200?text=Artifact+14",
  },
  {
    id: 15,
    artifactCode: "A015",
    title: "조선 목판 인쇄본",
    description: "조선시대 목판으로 인쇄된 책.",
    imageUrl: "https://via.placeholder.com/300x200?text=Artifact+15",
  },
  {
    id: 16,
    artifactCode: "A016",
    title: "석굴암 본존불상",
    description: "통일신라의 걸작으로 평가받는 석굴암의 중심 불상.",
    imageUrl: "https://via.placeholder.com/300x200?text=Artifact+16",
  },
];
