import React from "react";

const codeBoxStyle = {
  display: 'inline-block',
  background: '#f4f7fb',
  color: '#2563eb',
  borderRadius: 6,
  padding: '4px 10px',
  fontSize: 15,
  fontFamily: 'Fira Mono, monospace',
  margin: '2px 0 2px 0',
};

const ApiRequestFormat = ({
  requestUrl,
  method,
  params,
  headerStructure,
  bodyStructure,
  requestExample,
  responseExample,
  responseFields = [],
  usageInfo = {},
  faqList = []
}) => {
  return (
    <div style={{ margin: '0 0 32px 0', background: '#f8fafc', borderRadius: 10, padding: '24px 20px' }}>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 14 }}>요청 형식 <span style={{ fontWeight: 400, fontSize: 15 }}>(Request Format)</span></div>
      <div style={{ color: '#222', fontSize: 15, marginBottom: 8, fontWeight: 600 }}>URL:</div>
      <div style={{ marginBottom: 10 }}>
        <span style={codeBoxStyle}>{requestUrl}</span>
      </div>
      <div style={{ color: '#222', fontSize: 15, marginBottom: 8, fontWeight: 600 }}>Method:</div>
      <div style={{ marginBottom: 18 }}>
        <span style={codeBoxStyle}>{method}</span>
      </div>
      <div style={{ color: '#222', fontSize: 15, marginBottom: 12 }}>
        <b>파라미터</b>
        <ul style={{ margin: '8px 0 0 18px', padding: 0 }}>
          {params.map((p, i) => (
            <li key={i}>
              <b>{p.name}</b> <span style={{ color: '#6b7684' }}>({p.type})</span> - {p.desc}
            </li>
          ))}
        </ul>
      </div>
      {headerStructure && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ color: '#222', fontWeight: 500, marginBottom: 4 }}>Header 구성:</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: '#3578e5', fontSize: 15 }}>
            {headerStructure.map((h, i) => (
              <li key={i} style={{ color: h.important ? '#222' : '#3578e5', fontWeight: h.important ? 600 : 400 }}>{h.name}</li>
            ))}
          </ul>
        </div>
      )}
      {bodyStructure && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ color: '#222', fontWeight: 500, marginBottom: 4 }}>Body 구조:</div>
          <pre style={{ background: '#181c23', color: '#fff', borderRadius: 6, padding: '12px 16px', fontSize: 15, fontFamily: 'Fira Mono, monospace', overflowX: 'auto', margin: 0 }}>{bodyStructure}</pre>
        </div>
      )}
      <div style={{ color: '#222', fontWeight: 500, marginBottom: 6 }}>요청 예시</div>
      <pre style={{ background: '#181c23', color: '#fff', borderRadius: 6, padding: '12px 16px', fontSize: 15, fontFamily: 'Fira Mono, monospace', overflowX: 'auto', marginBottom: 18 }}>{requestExample}</pre>
      <div style={{ color: '#222', fontWeight: 500, marginBottom: 6 }}>응답 예시</div>
      <pre style={{ background: '#181c23', color: '#fff', borderRadius: 6, padding: '12px 16px', fontSize: 15, fontFamily: 'Fira Mono, monospace', overflowX: 'auto', marginBottom: 18 }}>{responseExample}</pre>
      {/* 필드 설명 */}
      {responseFields.length > 0 && (
        <div style={{ margin: '24px 0 0 0' }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>필드 설명</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 15 }}>
            {responseFields.map((f, i) => (
              <li key={i} style={{ marginBottom: 2 }}>
                <span style={{ color: '#2563eb', fontWeight: 600 }}>{f.name}</span>: <span style={{ color: '#222' }}>{f.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* 사용 제한/요금제 정보 */}
      {usageInfo && usageInfo.limit && (
        <div style={{ margin: '32px 0 0 0', background: '#f4f7fb', borderRadius: 10, padding: '20px 24px', fontSize: 15 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>사용 제한 / 요금제 정보</div>
          <div style={{ marginBottom: 4 }}><b>일일 요청 제한:</b> {usageInfo.limit}</div>
          <div style={{ marginBottom: 4 }}><b>요금제:</b> {usageInfo.price}</div>
          <div style={{ marginBottom: 4 }}><b>SLA:</b> {usageInfo.sla}</div>
          <div><b>기술지원:</b> {usageInfo.support}</div>
        </div>
      )}
      {/* FAQ 및 오류 코드 */}
      {faqList.length > 0 && (
        <div style={{ margin: '32px 0 0 0' }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>FAQ 및 오류 코드</div>
          <ul style={{ margin: 0, paddingLeft: 0, fontSize: 15, listStyle: 'none' }}>
            {faqList.map((f, i) => (
              <li key={i} style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 600 }}>{f.code}</span> <span style={{ color: '#222' }}>{f.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ApiRequestFormat; 