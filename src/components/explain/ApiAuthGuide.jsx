import React from "react";

const ApiAuthGuide = ({ example }) => {
  return (
    <div style={{ margin: '0 0 32px 0', background: '#f8fafc', borderRadius: 10, padding: '24px 20px' }}>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>API 인증 안내</div>
      <div style={{ color: '#6b7684', fontSize: 15, marginBottom: 14 }}>
        API 요청 시 발급받은 토큰을 Authorization 헤더에 Bearer 방식으로 포함해야 합니다.
      </div>
      <pre style={{ background: '#181c23', color: '#fff', borderRadius: 6, padding: '12px 16px', fontSize: 15, fontFamily: 'Fira Mono, monospace', overflowX: 'auto' }}>
        {example}
      </pre>
    </div>
  );
};

export default ApiAuthGuide; 