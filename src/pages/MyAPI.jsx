import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setClientIds } from "../redux/features/clientIdSlice";
import MyAPIDetail from "../components/modules/MyAPI/detail";
import MyAPIList from "../components/modules/MyAPI/list";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  padding: 0;
  padding-top: 40px;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const Navigation = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const BackLink = styled.span`
  color: #3578e5;
  cursor: pointer;
  margin-right: 16px;
  white-space: nowrap;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.8rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
  margin-left: auto;

  @media (max-width: 768px) {
    gap: 6px;
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  white-space: nowrap;
  font-size: 0.95rem;

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 0.85rem;
  }
`;

const PrimaryButton = styled(Button)`
  border: none;
  background: #3578e5;
  color: #fff;
`;

const MyAPI = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [view, setView] = useState(location.state?.view || "list");

  // location.state가 변경될 때 view 상태 업데이트
  useEffect(() => {
    if (location.state?.view) {
      setView(location.state.view);
    }
  }, [location.state]);

  return (
    <Container>
      <ContentWrapper>
        <Navigation>
          <BackLink onClick={() => navigate("/")}>
            &lt; 메인으로 돌아가기
          </BackLink>
        </Navigation>
        <Header>
          <Title>나의 애플리케이션</Title>
          <ButtonGroup>
            <Button onClick={() => setView("list")}>
              목록 보기
            </Button>
            <Button onClick={() => setView("detail")}>
              상세 보기
            </Button>
            <PrimaryButton onClick={() => navigate("/usage")}>
              + 새 애플리케이션
            </PrimaryButton>
          </ButtonGroup>
        </Header>
      </ContentWrapper>
      {view === "detail" ? <MyAPIDetail /> : <MyAPIList />}
    </Container>
  );
};

export default MyAPI;
