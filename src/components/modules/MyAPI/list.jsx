import React from "react";
import styled from "styled-components";

const TableWrapper = styled.div`
  background: #fafbfc;
  border-radius: 12px;
  padding: 24px 32px 12px 32px;
  margin-top: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;
const AppTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
const Th = styled.th`
  background: #f3f4f6;
  color: #374151;
  font-weight: 600;
  padding: 14px 0;
  border-bottom: 2px solid #e5e7eb;
  text-align: left;
`;
const Td = styled.td`
  padding: 18px 0;
  border-bottom: 1px solid #e5e7eb;
  color: #222;
  font-size: 1.05rem;
`;
const Status = styled.span`
  color: #22c55e;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
`;
const DeleteBtn = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const appList = [
  {
    name: "뉴스 분석 애플리케이션",
    type: "뉴스분석 API",
    status: "활성화됨",
    issued: "2023년 10월 15일",
  },
  {
    name: "금융 데이터 분석기",
    type: "채권재무분석 API",
    status: "활성화됨",
    issued: "2023년 11월 5일",
  },
];

const MyAPIList = () => {
  return (
    <TableWrapper>
      <AppTable>
        <thead>
          <tr>
            <Th>애플리케이션 이름</Th>
            <Th>API 타입</Th>
            <Th>상태</Th>
            <Th>발급일</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {appList.map((row) => (
            <tr key={row.name}>
              <Td>{row.name}</Td>
              <Td>{row.type}</Td>
              <Td><Status>✔ 활성화됨</Status></Td>
              <Td>{row.issued}</Td>
              <Td>
                <DeleteBtn title="삭제">
                  <span role="img" aria-label="delete">🗑️</span>
                </DeleteBtn>
              </Td>
            </tr>
          ))}
        </tbody>
      </AppTable>
    </TableWrapper>
  );
};

export default MyAPIList;
