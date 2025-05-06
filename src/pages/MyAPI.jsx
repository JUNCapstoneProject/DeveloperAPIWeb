import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MyAPIDetail from "../components/modules/MyAPI/detail";
import MyAPIList from "../components/modules/MyAPI/list";

const MyAPI = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("detail"); // 'detail' 또는 'list'

  return (
    <div style={{ width: "100%", padding: 0, paddingTop: 40 }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 32px" }}>
        {/* 상단 네비게이션 */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
          <span
            style={{ color: "#3578e5", cursor: "pointer", marginRight: 16 }}
            onClick={() => navigate("/")}
          >
            &lt; 메인으로 돌아가기
          </span>
        </div>
        {/* 제목과 버튼 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <h1 style={{ margin: 0 }}>나의 애플리케이션</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={{ padding: "8px 16px", border: "1px solid #d1d5db", borderRadius: 4, background: "#fff", cursor: "pointer" }}
              onClick={() => setView("list")}
            >
              목록 보기
            </button>
            <button
              style={{ padding: "8px 16px", border: "1px solid #d1d5db", borderRadius: 4, background: "#fff", cursor: "pointer" }}
              onClick={() => setView("detail")}
            >
              상세 보기
            </button>
            <button
              style={{ padding: "8px 16px", border: "#3578e5", background: "#3578e5", color: "#fff", borderRadius: 4, cursor: "pointer" }}
              onClick={() => navigate("/usage")}
            >+ 새 애플리케이션</button>
          </div>
        </div>
      </div>
      {view === "detail" ? <MyAPIDetail /> : <MyAPIList />}
    </div>
  );
};

export default MyAPI;
