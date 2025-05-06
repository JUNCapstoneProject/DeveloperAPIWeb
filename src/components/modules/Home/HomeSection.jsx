import React from "react";
import styled from "styled-components";

const HomeSection = () => {
  return (
    <SectionWrapper>
      <Top>
        <Title>
          <span className="blue">AI로 스마트한</span>
          <br />
          금융 투자 API를 도입하세요
        </Title>
        <Desc>
          인공지능이 분석한 정보와 투자 전략으로 더 현명한 자산 관리를 경험하세요.<br />
          투자인 API로 혁신적인 금융 서비스를 구현해보세요.
        </Desc>
      </Top>
    </SectionWrapper>
  );
};

export default HomeSection;

// styled-components
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

const Title = styled.h1`
  font-size: 48px;
  font-weight: 800;
  color: #222;
  margin-bottom: 18px;
  line-height: 1.2;
  .blue {
    color: #0066e6;
  }
`;

const Desc = styled.p`
  font-size: 18px;
  color: #6b7684;
  line-height: 1.6;
  margin-bottom: 0;
`;
