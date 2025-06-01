import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../redux/features/authSelectors';
import { Navigate } from 'react-router-dom';
import AccountContent from '../components/modules/mypage/AccountContent';
import SecurityContent from '../components/modules/mypage/SecurityContent';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: #ffffff;
  min-height: 100vh;
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 2rem;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  background: #ffffff;
  border-radius: 8px;
  /*box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);*/
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.active ? '#4A55A7' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : '#666'};
  border: 1px solid ${props => props.active ? '#4A55A7' : '#ccc'};
  cursor: pointer;
  font-size: 1rem;
  font-weight: ${props => props.active ? '600' : '400'};
  border-radius: 6px;
  transition: all 0.2s ease;
  margin-right: 0.5rem;

  &:hover {
    background: ${props => props.active ? '#4A55A7' : 'rgba(74, 85, 167, 0.1)'};
    color: ${props => props.active ? '#ffffff' : '#4A55A7'};
    border-color: #4A55A7;
  }
`;


const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const MyPage = () => {
  const [activeTab, setActiveTab] = React.useState('계정 설정');

  /*
  if (!isLoggedIn) {  
    return <Navigate to="/login" replace />;
  }
  */
  return (
    <Container>
      <PageTitle>마이페이지</PageTitle>
      <TabContainer>
        <Tab active={activeTab === '계정 설정'} onClick={() => setActiveTab('계정 설정')}>
          계정 설정
        </Tab>
        <Tab active={activeTab === '보안'} onClick={() => setActiveTab('보안')}>
          보안
        </Tab>
      </TabContainer>

      <Content>
        {activeTab === '계정 설정' ? <AccountContent /> : <SecurityContent />}
      </Content>
    </Container>
  );
};

export default MyPage;