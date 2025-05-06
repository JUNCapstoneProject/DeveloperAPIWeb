import React from "react";
import { useNavigate } from "react-router-dom";

const buttonStyle = {
  padding: "8px 18px",
  border: "1.5px solid #0066e6",
  borderRadius: 6,
  background: "#fff",
  color: "#0066e6",
  fontWeight: 500,
  fontSize: 15,
  cursor: "pointer",
  marginRight: 12,
  transition: "background 0.2s, color 0.2s",
};
const blueButtonStyle = {
  ...buttonStyle,
  background: "#0066e6",
  color: "#fff",
  border: "none",
  marginRight: 0,
};

const ExplainHeader = () => {
  const navigate = useNavigate();
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
      <button style={buttonStyle} onClick={() => navigate("/")}>{"< 메인으로 돌아가기"}</button>
      <button style={blueButtonStyle} onClick={() => navigate("/usage")}>API 키 신청하기</button>
    </div>
  );
};

export default ExplainHeader; 