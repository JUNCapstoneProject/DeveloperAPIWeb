import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import fetchWithAssist from "../../../fetchWithAssist";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MyAPIDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const clientId = location.state?.clientId;
  const [copied, setCopied] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appData, setAppData] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState("");
  const [nameError, setNameError] = useState(null);

  useEffect(() => {
    if (!clientId) {
      navigate("/apps");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await fetchWithAssist(
          `${API_BASE_URL}/api/client/detail/${clientId}`,
          {
            headers: {
              Authorization: `${accessToken}`,
              "x-destination": "analysis",
            },
          }
        );
        const data = await res.json();
        if (data.success) {
          setAppData({
            applicationName: data.response.appName,
            apiKey: data.response.clientId,
            secretKey: data.response.clientSecret,
            status: data.response.status,
            issuedAt: data.response.createdAt,
            enabledApi:
              data.response.apiCategoryId === "1"
                ? ["news"]
                : data.response.apiCategoryId === "2"
                ? ["finance"]
                : ["news", "finance"],
          });
        } else {
          setError("데이터를 불러오지 못했습니다.");
        }
      } catch {
        setError("네트워크 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [clientId, navigate]);

  const handleCopy = () => {
    if (!appData) return;
    navigator.clipboard.writeText(appData.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleCopySecret = () => {
    if (!appData) return;
    navigator.clipboard.writeText(appData.secretKey);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 1500);
  };

  const handleEditNameClick = () => {
    setEditName(appData.applicationName);
    setIsEditingName(true);
    setNameError(null);
  };

  const handleEditNameChange = (event) => {
    setEditName(event.target.value);
  };

  const handleEditNameCancel = () => {
    setIsEditingName(false);
    setEditName("");
    setNameError(null);
  };

  const handleEditNameSave = async () => {
    if (!editName.trim()) {
      setNameError("이름을 입력해주세요.");
      return;
    }
    try {
      const res = await fetchWithAssist(
        `${API_BASE_URL}/api/client/${clientId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newName: editName.trim() }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setAppData((prev) => ({
          ...prev,
          applicationName: data.response.appName,
        }));
        setIsEditingName(false);
        setNameError(null);
      } else {
        setNameError(data.error || "이름 변경에 실패했습니다.");
      }
    } catch {
      setNameError("서버와의 통신 중 오류가 발생했습니다.");
    }
  };

  const handleEditNameKeyDown = (event) => {
    if (event.key === "Enter") {
      handleEditNameSave();
    } else if (event.key === "Escape") {
      handleEditNameCancel();
    }
  };

  if (loading) return <Container>로딩 중...</Container>;
  if (error) return <Container>{error}</Container>;
  if (!appData) return <Container>데이터 없음</Container>;

  return (
    <Container>
      <AppTitle>
        {isEditingName ? (
          <>
            <input
              value={editName}
              onChange={handleEditNameChange}
              onKeyDown={handleEditNameKeyDown}
              autoFocus
              style={{
                fontSize: "1.1rem",
                padding: "2px 8px",
                borderRadius: 4,
                border: "1px solid #ddd",
                marginRight: 8,
              }}
              maxLength={30}
            />
            <button
              onClick={handleEditNameSave}
              style={{
                marginRight: 4,
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "2px 10px",
                cursor: "pointer",
              }}
            >
              저장
            </button>
            <button
              onClick={handleEditNameCancel}
              style={{
                background: "#eee",
                color: "#333",
                border: "none",
                borderRadius: 4,
                padding: "2px 10px",
                cursor: "pointer",
              }}
            >
              취소
            </button>
            {nameError && (
              <span
                style={{ color: "red", marginLeft: 8, fontSize: "0.97rem" }}
              >
                {nameError}
              </span>
            )}
          </>
        ) : (
          <>
            {appData.applicationName}
            <span
              role="img"
              aria-label="edit"
              style={{ cursor: "pointer" }}
              onClick={handleEditNameClick}
            >
              ✏️
            </span>
          </>
        )}
      </AppTitle>
      <ApiKeySection>
        <ApiKeyLabel>API 키</ApiKeyLabel>
        <ApiKeyBox>
          <span>{appData.apiKey}</span>
          <CopyBtn onClick={handleCopy}>
            {copied ? (
              "복사됨"
            ) : (
              <span role="img" aria-label="copy">
                📋
              </span>
            )}
          </CopyBtn>
        </ApiKeyBox>
        <ApiKeyLabel style={{ marginTop: "8px" }}>Secret 키</ApiKeyLabel>
        <ApiKeyBox>
          <span>{appData.secretKey}</span>
          <CopyBtn onClick={handleCopySecret}>
            {copiedSecret ? (
              "복사됨"
            ) : (
              <span role="img" aria-label="copy">
                📋
              </span>
            )}
          </CopyBtn>
        </ApiKeyBox>
        <ApiKeyMeta>
          {appData.enabledApi?.includes("news") && (
            <ApiBadge type="news">뉴스분석 API</ApiBadge>
          )}
          {appData.enabledApi?.includes("finance") && (
            <ApiBadge type="finance">재무지표분석 API</ApiBadge>
          )}
          <ApiIssued>발급일: {appData.issuedAt}</ApiIssued>
          <ApiStatus $status={appData.status}>
            ● {appData.status === "ACTIVE" ? "활성화됨" : "비활성화"}
          </ApiStatus>
        </ApiKeyMeta>
      </ApiKeySection>
    </Container>
  );
};

const Container = styled.div`
  padding: 32px 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  max-width: 1100px;
  margin: 0 auto;
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
  font-family: "Fira Mono", monospace;
  font-size: 1rem;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    margin-right: 12px;
  }
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
  &:hover {
    background: #3a3f4b;
  }
`;
const ApiKeyMeta = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;
const ApiBadge = styled.span`
  background: ${(props) => (props.type === "news" ? "#e6f0ff" : "#f5e6ff")};
  color: ${(props) => (props.type === "news" ? "#2563eb" : "#a21caf")};
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
  color: ${(props) => (props.$status === "ACTIVE" ? "#22c55e" : "#ef4444")};
  font-size: 0.95rem;
  font-weight: 600;
`;

export default MyAPIDetail;
