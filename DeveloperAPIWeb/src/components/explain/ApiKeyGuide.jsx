import React from "react";
import { useNavigate } from "react-router-dom";

const ApiKeyGuide = () => {
  const navigate = useNavigate();
  return (
    <div style={{ margin: '40px 0 32px 0', background: '#f4f7fb', borderRadius: 10, padding: '24px 20px' }}>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>API 키 신청</div>
      <div style={{ color: '#6b7684', fontSize: 15, marginBottom: 18 }}>
        API 키를 발급받으려면 API 키 신청 페이지에서 필요한 정보를 입력하세요.
      </div>
      <button
        style={{ padding: '10px 24px', background: '#0066e6', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 500, fontSize: 15, cursor: 'pointer' }}
        onClick={() => navigate('/usage')}
      >
        API 키 신청 페이지로 이동
      </button>
    </div>
  );
};

export default ApiKeyGuide; 