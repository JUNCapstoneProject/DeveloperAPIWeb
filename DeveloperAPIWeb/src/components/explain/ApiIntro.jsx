import React from "react";

const ApiIntro = ({ icon, title, desc, features }) => {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <span style={{ fontSize: 32, color: '#0066e6' }}>{icon}</span>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>{title}</h1>
      </div>
      <div style={{ color: '#6b7684', fontSize: 16, marginBottom: 18 }}>{desc}</div>
      <div style={{ background: '#f8fafc', borderRadius: 10, padding: '18px 20px', marginBottom: 0 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>주요 기능</div>
        <ul style={{ margin: 0, paddingLeft: 18, color: '#222', fontSize: 15 }}>
          {features.map((f, i) => <li key={i}>{f}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default ApiIntro; 