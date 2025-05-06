import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 32px 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  max-width: 1100px;
  margin: 0 auto;
`;
const Tabs = styled.div`
  display: flex;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 24px;
  gap: 32px;
`;
const Tab = styled.button`
  background: none;
  border: none;
  outline: none;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.active ? '#2563eb' : '#64748b'};
  border-bottom: 3px solid ${props => props.active ? '#2563eb' : 'transparent'};
  padding: 8px 0 12px 0;
  cursor: pointer;
  transition: color 0.2s, border-bottom 0.2s;
`;
const AppTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
`;
const ApiKeySection = styled.div`
  margin-bottom: 32px;
`;
const ApiKeyLabel = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
`;
const ApiKeyBox = styled.div`
  background: #181c23;
  color: #fff;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Fira Mono', monospace;
  font-size: 1rem;
`;
const CopyBtn = styled.button`
  background: #23272f;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 4px 10px;
  margin-left: 12px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
  &:hover { background: #3a3f4b; }
`;
const ApiKeyMeta = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;
const ApiBadge = styled.span`
  background: ${props => props.type === 'news' ? '#e6f0ff' : '#f5e6ff'};
  color: ${props => props.type === 'news' ? '#2563eb' : '#a21caf'};
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 6px;
  padding: 3px 10px;
`;
const ApiIssued = styled.span`
  color: #6b7280;
  font-size: 0.95rem;
`;
const ApiStatus = styled.span`
  color: #22c55e;
  font-size: 0.95rem;
  font-weight: 600;
`;
const StatsCards = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 8px;
  flex-wrap: wrap;
`;
const StatCard = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px 24px;
  min-width: 200px;
  flex: 1 1 200px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const StatTitle = styled.div`
  font-size: 1.05rem;
  color: #64748b;
  margin-bottom: 8px;
`;
const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 6px;
`;
const StatDesc = styled.div`
  font-size: 0.98rem;
  color: #64748b;
  margin-bottom: 8px;
  &.processing { color: #fbbf24; font-weight: 600; }
  &.success { color: #22c55e; font-weight: 600; }
`;
const StatBar = styled.div`
  width: 100%;
  height: 7px;
  background: #e0e7ef;
  border-radius: 4px;
  overflow: hidden;
`;
const StatBarInner = styled.div`
  height: 100%;
  background: #2563eb;
`;

// 분석 요청 상태용 예시 테이블 스타일
const StatusTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 24px;
`;
const StatusTh = styled.th`
  background: #f3f4f6;
  color: #374151;
  font-weight: 600;
  padding: 10px 0;
  border-bottom: 2px solid #e5e7eb;
`;
const StatusTd = styled.td`
  padding: 12px 0;
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
  color: #374151;
`;
const StatusDot = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.color || '#d1d5db'};
  margin-right: 6px;
`;

// 상태 뱃지
const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.98rem;
  font-weight: 500;
  border-radius: 12px;
  padding: 2px 12px;
  background: ${props => {
    if (props.status === '완료') return '#e6fbe8';
    if (props.status === '처리 중') return '#fffbe6';
    if (props.status === '실패') return '#fee2e2';
    return '#f3f4f6';
  }};
  color: ${props => {
    if (props.status === '완료') return '#22c55e';
    if (props.status === '처리 중') return '#fbbf24';
    if (props.status === '실패') return '#ef4444';
    return '#64748b';
  }};
`;
const StatusIcon = styled.span`
  font-size: 1.1em;
`;
const ApiType = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #2563eb;
  font-weight: 500;
`;
const TableWrapper = styled.div`
  background: #fafbfc;
  border-radius: 12px;
  padding: 24px 18px 12px 18px;
  margin-top: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
`;
const TableTitle = styled.div`
  font-size: 1.13rem;
  font-weight: 600;
  margin-bottom: 16px;
`;
const ActionLink = styled.a`
  color: #2563eb;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;
const Pagination = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 18px 0 0 0;
  justify-content: flex-end;
`;
const PageBtn = styled.button`
  background: ${props => props.active ? '#2563eb' : '#fff'};
  color: ${props => props.active ? '#fff' : '#2563eb'};
  border: 1px solid #2563eb;
  border-radius: 6px;
  padding: 3px 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  &:disabled { color: #b6c3e0; border-color: #e5e7eb; background: #f3f4f6; cursor: not-allowed; }
`;
const TableInfo = styled.div`
  color: #64748b;
  font-size: 0.97rem;
  margin-top: 8px;
`;

const requestList = [
  { id: 'req_5f9a8b2c3d', type: '뉴스분석 API', typeIcon: '📄', time: '2023-10-20 14:32:45', status: '완료', duration: '2.3초', action: '결과 보기' },
  { id: 'req_4e8d7c6b5a', type: '재무지표분석 API', typeIcon: '📊', time: '2023-10-20 13:15:22', status: '완료', duration: '5.7초', action: '결과 보기' },
  { id: 'req_3d2c1b0a9f', type: '뉴스분석 API', typeIcon: '📄', time: '2023-10-20 11:47:33', status: '처리 중', duration: '-', action: '-' },
  { id: 'req_2b1a0z9y8x', type: '재무지표분석 API', typeIcon: '📊', time: '2023-10-20 10:23:18', status: '실패', duration: '-', action: '오류 상세' },
  { id: 'req_1z0y9x8w7v', type: '뉴스분석 API', typeIcon: '📄', time: '2023-10-19 16:55:41', status: '완료', duration: '1.8초', action: '결과 보기' },
  { id: 'req_0w9v8u7t6s', type: '재무지표분석 API', typeIcon: '📊', time: '2023-10-19 15:22:37', status: '완료', duration: '4.2초', action: '결과 보기' },
  { id: 'req_9v8u7t6s5r', type: '뉴스분석 API', typeIcon: '📄', time: '2023-10-19 14:18:29', status: '완료', duration: '2.5초', action: '결과 보기' },
  { id: 'req_8u7t6s5r4q', type: '뉴스분석 API', typeIcon: '📄', time: '2023-10-19 12:45:13', status: '완료', duration: '2.1초', action: '결과 보기' },
  { id: 'req_7t6s5r4q3p', type: '재무지표분석 API', typeIcon: '📊', time: '2023-10-19 11:32:08', status: '실패', duration: '-', action: '오류 상세' },
  { id: 'req_6s5r4q3p2o', type: '뉴스분석 API', typeIcon: '📄', time: '2023-10-19 10:15:52', status: '완료', duration: '1.9초', action: '결과 보기' },
];

const MyAPIDetail = () => {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState('overview');
  const apiKey = 'sk_live_51NzQHpJklIEYQ8BGxrVu2Jz1GLHa8KhvbkOF';

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Container>
      <AppTitle>뉴스 분석 애플리케이션 <span role="img" aria-label="edit">✏️</span></AppTitle>
      <ApiKeySection>
        <ApiKeyLabel>API 키 정보</ApiKeyLabel>
        <ApiKeyBox>
          <span>{apiKey}</span>
          <CopyBtn onClick={handleCopy}>
            {copied ? '복사됨' : <span role="img" aria-label="copy">📋</span>}
          </CopyBtn>
        </ApiKeyBox>
        <ApiKeyMeta>
          <ApiBadge type="news">뉴스분석 API</ApiBadge>
          <ApiBadge type="finance">재무지표분석 API</ApiBadge>
          <ApiIssued>발급일: 2023년 10월 15일</ApiIssued>
          <ApiStatus>● 활성화됨</ApiStatus>
        </ApiKeyMeta>
      </ApiKeySection>
      <Tabs>
        <Tab active={tab === 'overview'} onClick={() => setTab('overview')}>개요</Tab>
        <Tab active={tab === 'status'} onClick={() => setTab('status')}>분석 요청 상태</Tab>
      </Tabs>
      {tab === 'overview' && (
        <StatsCards>
          <StatCard>
            <StatTitle>오늘 API 호출</StatTitle>
            <StatValue>247</StatValue>
            <StatDesc>일일 한도: 1,000건</StatDesc>
            <StatBar>
              <StatBarInner style={{width: '24.7%'}} />
            </StatBar>
          </StatCard>
          <StatCard>
            <StatTitle>진행 중인 분석</StatTitle>
            <StatValue>3</StatValue>
            <StatDesc className="processing">● 처리 중</StatDesc>
          </StatCard>
          <StatCard>
            <StatTitle>성공률</StatTitle>
            <StatValue>98.2%</StatValue>
            <StatDesc className="success">● 양호</StatDesc>
          </StatCard>
        </StatsCards>
      )}
      {tab === 'status' && (
        <TableWrapper>
          <TableTitle>분석 요청 목록</TableTitle>
          <StatusTable>
            <thead>
              <tr>
                <StatusTh>요청 ID</StatusTh>
                <StatusTh>API 유형</StatusTh>
                <StatusTh>요청 시간</StatusTh>
                <StatusTh>상태</StatusTh>
                <StatusTh>처리 시간</StatusTh>
                <StatusTh>작업</StatusTh>
              </tr>
            </thead>
            <tbody>
              {requestList.map((row, idx) => (
                <tr key={row.id}>
                  <StatusTd>{row.id}</StatusTd>
                  <StatusTd><ApiType>{row.typeIcon} {row.type}</ApiType></StatusTd>
                  <StatusTd>{row.time}</StatusTd>
                  <StatusTd>
                    <StatusBadge status={row.status}>
                      <StatusIcon>
                        {row.status === '완료' && '✔️'}
                        {row.status === '처리 중' && '⏱️'}
                        {row.status === '실패' && '❌'}
                      </StatusIcon>
                      {row.status}
                    </StatusBadge>
                  </StatusTd>
                  <StatusTd>{row.duration}</StatusTd>
                  <StatusTd>
                    {row.action === '결과 보기' && <ActionLink>결과 보기</ActionLink>}
                    {row.action === '오류 상세' && <ActionLink style={{color:'#ef4444'}}>오류 상세</ActionLink>}
                    {row.action === '-' && '-'}
                  </StatusTd>
                </tr>
              ))}
            </tbody>
          </StatusTable>
          <TableInfo>총 125개 요청 중 1-10 표시</TableInfo>
          <Pagination>
            <PageBtn disabled>이전</PageBtn>
            <PageBtn active>1</PageBtn>
            <PageBtn>2</PageBtn>
            <PageBtn>3</PageBtn>
            <PageBtn>다음</PageBtn>
          </Pagination>
        </TableWrapper>
      )}
    </Container>
  );
};

export default MyAPIDetail;
