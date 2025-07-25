import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiOptions = [
  {
    key: "news",
    title: "뉴스분석 API",
    desc: "최신 뉴스 및 미디어 분석을 통해 AI가 신뢰할 종목 정보를 제공합니다.",
    features: [
      "실시간 뉴스 감정 분석",
      "종목별 뉴스 영향도 평가",
      "뉴스 기반 투자 신호 감지",
      "글로벌 뉴스 트렌드 분석",
    ],
    icon: "\uD83D\uDCC4", // 문서 아이콘
  },
  {
    key: "finance",
    title: "재무제표분석 API",
    desc: "기업 재무제표 분석을 통해 AI가 신뢰할 종목 정보를 제공합니다.",
    features: [
      "재무 건전성 평가",
      "성장성 및 수익성 분석",
      "기업 가치 평가",
      "경쟁사 비교 분석",
    ],
    icon: "\uD83D\uDCCA", // 그래프 아이콘
  },
];

const ApplyCard = () => {
  const [selected, setSelected] = useState({ news: false, finance: false });
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [appName, setAppName] = useState("");
  const navigate = useNavigate();

  const handleCheck = (key) => {
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected.news && !selected.finance) {
      setError("* 최소 하나 이상의 API를 선택해 주세요.");
      return;
    }
    if (!appName.trim()) {
      setError("* 애플리케이션 이름을 입력해 주세요.");
      return;
    }
    setError("");
  
    // ✅ 앱 카테고리 ID 결정
    let appCategoryId = 1;
    if (selected.news && selected.finance) appCategoryId = 3;
    else if (selected.finance) appCategoryId = 2;
  
    // developerId를 localStorage에서 불러오기
    const developerId = localStorage.getItem("developerId");
    if (!developerId) {
      setError("로그인이 필요합니다. 다시 로그인 해주세요.");
      return;
    }

    const payload = {
      developerId: Number(developerId),
      appCategoryId,
      apiCategoryId: 1, // 고정 값
      appName: appName.trim(),
      callbackUrl: "https://my-app.com/callback", // 실제 값으로 교체 가능
    };
  
    try {
      const res = await axiosInstance.post(`${API_BASE_URL}/api/client`, payload, {
        headers: {
          "Content-Type": "application/json",
          "x-destination": "analysis",
        },
      });
  
      if (res.data.success) {
        setShowModal(true);
      } else {
        setError(
          typeof res.data.error === "string"
            ? res.data.error
            : res.data.error?.message || "알 수 없는 오류가 발생했습니다."
        );
      }
    } catch (err) {
      if (err.response?.data?.error) {
        setError(
          typeof err.response.data.error === "string"
            ? err.response.data.error
            : err.response.data.error.message
        );
      } else {
        setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }
    }
  };
  
  const handleModalClose = () => {
    setShowModal(false);
    navigate("/apps");
  };

  return (
    <CardWrapper>
      <Title>API 키 신청</Title>
      <SubDesc>원하시는 API를 선택하고 필요한 정보를 입력하여 API 키를 신청하세요.</SubDesc>
      <SectionTitle>애플리케이션 이름</SectionTitle>
      <AppNameInput
        type="text"
        placeholder="애플리케이션 이름을 입력하세요"
        value={appName}
        onChange={(e) => setAppName(e.target.value)}
        maxLength={30}
      />
      <SectionTitle>API 선택</SectionTitle>
      <ApiSelectRow>
        {apiOptions.map((api) => (
          <ApiBox key={api.key} selected={selected[api.key]}>
            <ApiHeader>
              <ApiIcon>{api.icon}</ApiIcon>
              <ApiTitle>{api.title}</ApiTitle>
              <ApiCheckBox
                type="checkbox"
                checked={selected[api.key]}
                onChange={() => handleCheck(api.key)}
              />
            </ApiHeader>
            <ApiDesc>{api.desc}</ApiDesc>
            <ApiFeatureList>
              {api.features.map((f, i) => (
                <li key={i}>✓ {f}</li>
              ))}
            </ApiFeatureList>
          </ApiBox>
        ))}
      </ApiSelectRow>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      <SubmitButton onClick={handleSubmit}>API 키 신청하기</SubmitButton>
      {showModal && (
        <ModalOverlay>
          <ModalBox>
            <ModalText>신청이 완료되었습니다.</ModalText>
            <ModalButton onClick={handleModalClose}>확인</ModalButton>
          </ModalBox>
        </ModalOverlay>
      )}
    </CardWrapper>
  );
};

export default ApplyCard;

const CardWrapper = styled.div`
  background: #fff;
  border: 1.5px solid #e5e8eb;
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 rgba(16, 30, 54, 0.04);
  padding: 40px 36px 32px 36px;
  width: 700px;
  max-width: 95vw;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #222;
  margin-bottom: 8px;
`;

const SubDesc = styled.div`
  color: #6b7684;
  font-size: 16px;
  margin-bottom: 32px;
`;

const SectionTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #222;
  align-self: flex-start;
  margin-bottom: 18px;
`;

const AppNameInput = styled.input`
  width: 100%;
  min-width: 0;
  max-width: 700px;
  box-sizing: border-box;
  padding: 12px 16px;
  border: 1.5px solid #e5e8eb;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 32px;
  &:focus {
    outline: none;
    border-color: #0066e6;
  }
`;

const ApiSelectRow = styled.div`
  display: flex;
  gap: 24px;
  width: 100%;
  margin-bottom: 12px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ApiBox = styled.div`
  flex: 1;
  background: #f9fbfc;
  border: 1.5px solid ${({ selected }) => (selected ? "#0066e6" : "#e5e8eb")};
  border-radius: 12px;
  padding: 24px 20px 18px 20px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 16px;
  }
`;

const ApiHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const ApiIcon = styled.span`
  font-size: 28px;
  margin-right: 10px;
`;

const ApiTitle = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: #222;
  flex: 1;
`;

const ApiCheckBox = styled.input`
  width: 20px;
  height: 20px;
  accent-color: #0066e6;
`;

const ApiDesc = styled.div`
  color: #6b7684;
  font-size: 14px;
  margin-bottom: 10px;
`;

const ApiFeatureList = styled.ul`
  color: #222;
  font-size: 15px;
  margin: 0;
  padding-left: 18px;
  li {
    margin-bottom: 4px;
    list-style: none;
  }
`;

const ErrorMsg = styled.div`
  color: #e53e3e;
  font-size: 15px;
  margin: 10px 0 0 0;
  align-self: flex-start;
`;

const SubmitButton = styled.button`
  margin-top: 32px;
  width: 100%;
  background: #0066e6;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 16px 0;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #0053b3;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
`;

const ModalText = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const ModalButton = styled.button`
  background: #0066e6;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background: #0053b3;
  }
`; 
