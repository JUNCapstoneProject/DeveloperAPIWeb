import React from "react";
import HomeSection from "../components/modules/Home/HomeSection";
import HomeCard from "../components/modules/Home/HomeCard";
import styled from "styled-components";
import { FiFileText, FiBarChart2 } from "react-icons/fi";

const Home = () => {
  return (
    <div>
      <HomeSection />
      <ApiSection>
        <ApiTitle>제공 API</ApiTitle>
        <ApiDesc>투자인에서 제공하는 AI 기반 금융 API 서비스를 확인해보세요</ApiDesc>
        <ApiCards>
          <HomeCard
            icon={<FiFileText size={28} color="#0066e6" />}
            title="뉴스분석 API"
            desc="최신 뉴스 및 미디어 분석을 통해 AI가 선별한 종목 정보를 제공합니다."
            list={[
              "실시간 뉴스 감성 분석",
              "종목별 뉴스 영향도 평가",
              "뉴스 기반 투자 신호 감지",
              "글로벌 뉴스 트렌드 분석"
            ]}
            buttonText="자세히 보기 →"
          />
          <HomeCard
            icon={<FiBarChart2 size={28} color="#0066e6" />}
            title="재무제표분석 API"
            desc="기업 재무제표 분석을 통해 AI가 선별한 종목 정보를 제공합니다."
            list={[
              "재무 건전성 평가",
              "성장성 및 우수성 분석",
              "기업 가치 평가",
              "경쟁사 비교 분석"
            ]}
            buttonText="자세히 보기 →"
          />
        </ApiCards>
      </ApiSection>
    </div>
  );
};

export default Home;

// styled-components
const ApiSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0;
  margin-bottom: 80px;
`;

const ApiTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #222;
  margin-bottom: 10px;
`;

const ApiDesc = styled.p`
  font-size: 16px;
  color: #6b7684;
  margin-bottom: 36px;
`;

const ApiCards = styled.div`
  display: flex;
  gap: 32px;
  justify-content: center;
  width: 100%;
  max-width: 900px;
`;

const SectionWrapper = styled.section`
  width: 100%;
  background: linear-gradient(180deg, #f8fafd 0%, #fff 100%);
  padding-top: 48px;
  padding-bottom: 0;
`;

const Top = styled.div`
  text-align: center;
  margin-bottom: 16px;
`;
