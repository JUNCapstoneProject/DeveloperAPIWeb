import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import fetchWithAssist from '../../../fetchWithAssist';

const TableWrapper = styled.div`
  background: #fafbfc;
  border-radius: 12px;
  padding: 24px 16px 12px 16px;
  margin-top: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  overflow-x: auto;

  @media (max-width: 768px) {
    padding: 16px 8px 8px 8px;
  }
`;

const AppTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
  table-layout: fixed;
`;

const Th = styled.th`
  background: #f3f4f6;
  color: #374151;
  font-weight: 600;
  padding: 14px 4px;
  border-bottom: 2px solid #e5e7eb;
  text-align: left;
  white-space: nowrap;
  font-size: 0.8rem;

  @media (max-width: 768px) {
    padding: 10px 2px;
    font-size: 0.7rem;
  }
`;

const Td = styled.td`
  padding: 18px 4px;
  border-bottom: 1px solid #e5e7eb;
  color: #222;
  font-size: 0.8rem;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    padding: 12px 2px;
    font-size: 0.7rem;
  }
`;

const ActionTd = styled.td`
  padding: 18px 4px;
  border-bottom: 1px solid #e5e7eb;
  color: #222;
  font-size: 0.8rem;
  cursor: default;
  white-space: nowrap;
  width: 50px;

  @media (max-width: 768px) {
    padding: 12px 2px;
    font-size: 0.7rem;
    width: 40px;
  }
`;

const Status = styled.span`
  color: #22c55e;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 2px;
  white-space: nowrap;
  font-size: 0.8rem;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const ActionCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  white-space: nowrap;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.disabled ? '#ccc' : '#ef4444'};
  font-weight: 600;
  font-size: 0.8rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  padding: 2px 4px;
  display: flex;
  align-items: center;
  gap: 2px;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 1px 2px;
  }
`;

const appCategoryMap = {
  1: "뉴스분석 API",
  2: "채권재무분석 API",
  3: "모두"
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MyAPIList = () => {
  const [appList, setAppList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);
  const [developerId, setDeveloperId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // localStorage에서 developerId 가져오기
    const storedDeveloperId = localStorage.getItem("developerId");
    setDeveloperId(storedDeveloperId);
  }, []);

  useEffect(() => {
    if (!developerId) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await fetchWithAssist(`${API_BASE_URL}/api/client/developer/${developerId}`, {
          headers: {
            "Authorization": `${accessToken}`,
            "x-destination": "analysis",
          }
        });
        if (!res.ok) throw new Error("API 요청 실패");
        const data = await res.json();
        if (data.success) {
          setAppList(data.response);
        } else {
          setError("데이터를 불러오지 못했습니다.");
        }
      } catch {
        setError("서버와 통신 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [developerId]);

  const handleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((i) => i !== id)); // ✅ 해제
    } else {
      setSelected([...selected, id]); // ✅ 추가
    }
  };

  const handleDeleteSelected = async () => {
    if (selected.length === 0) return;
    if (!window.confirm("선택한 애플리케이션을 삭제하시겠습니까?")) return;

    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await fetchWithAssist(`${API_BASE_URL}/api/client/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${accessToken}`
        },
        body: JSON.stringify(selected),
      });
      const data = await res.json();

      if (data.success) {
        setSelected([]);
        if (developerId) fetchData();
      } else {
        let msg = "삭제에 실패했습니다.";
        if (data.error) msg += "\n" + data.error;
        alert(msg);
      }
    } catch {
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  // fetchData를 handleDeleteSelected에서도 쓸 수 있도록 함수로 분리
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await fetchWithAssist(`${API_BASE_URL}/api/client/developer/${developerId}`, {
        headers: {
          "Authorization": `${accessToken}`
        }
      });
      if (!res.ok) throw new Error("API 요청 실패");
      const data = await res.json();
      if (data.success) {
        setAppList(data.response);
      } else {
        setError("데이터를 불러오지 못했습니다.");
      }
    } catch {
      setError("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (clientId) => {
    navigate('/apps', { state: { clientId, view: 'detail' } });
  };

  return (
    <TableWrapper>
      {loading ? (
        <div>로딩 중...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <AppTable>
          <thead>
            <tr>
              <Th style={{ width: '25%' }}>애플리케이션</Th>
              <Th style={{ width: '20%' }}>API타입</Th>
              <Th style={{ width: '15%' }}>상태</Th>
              <Th style={{ width: '20%' }}>발급일</Th>
              <Th style={{ width: '20%' }}>
                <ActionCell>
                  <span style={{ fontSize: "0.9rem" }}>🗑️</span>
                  <DeleteButton
                    onClick={handleDeleteSelected}
                    disabled={selected.length === 0}
                    title="선택한 애플리케이션 삭제"
                  >
                    삭제
                  </DeleteButton>
                </ActionCell>
              </Th>
            </tr>
          </thead>
          <tbody>
            {appList.map((row) => (
              <tr key={row.clientId}>
                <Td onClick={() => handleRowClick(row.clientId)} title={row.appName}>{row.appName}</Td>
                <Td onClick={() => handleRowClick(row.clientId)}>{appCategoryMap[row.appCategoryId] || row.appCategoryId}</Td>
                <Td onClick={() => handleRowClick(row.clientId)}><Status>✔ {row.status === "Active" ? "활성화됨" : row.status}</Status></Td>
                <Td onClick={() => handleRowClick(row.clientId)}>{row.createdAt.replace(/-(\d{2})-(\d{2})$/, "년 $1월 $2일")}</Td>
                <ActionTd>
                  <ActionCell>
                    <input
                      type="checkbox"
                      checked={selected.includes(row.clientId)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelect(row.clientId);
                      }}
                      style={{ width: '14px', height: '14px' }}
                    />
                  </ActionCell>
                </ActionTd>
              </tr>
            ))}
          </tbody>
        </AppTable>
      )}
    </TableWrapper>
  );
};

export default MyAPIList;
