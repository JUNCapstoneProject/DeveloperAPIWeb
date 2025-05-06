import React, { useState } from "react";
import ApiIntro from "./ApiIntro";
import ApiKeyGuide from "./ApiKeyGuide";
import ApiAuthGuide from "./ApiAuthGuide";
import ApiRequestFormat from "./ApiRequestFormat";

const apiData = {
  news: {
    icon: "\uD83D\uDCC4",
    title: "AI 뉴스분석 API",
    desc: "AI 뉴스분석 API는 최신 뉴스 및 미디어 데이터를 분석하여 종목별 뉴스 영향도, 감정 분석, 투자 신호 등을 제공합니다. 머신러닝 기반으로 실시간 트렌드와 투자 인사이트를 제공합니다.",
    features: [
      "실시간 뉴스 감성 분석",
      "종목별 뉴스 영향도 평가",
      "뉴스 기반 투자 신호 감지",
      "글로벌 뉴스 트렌드 분석"
    ],
    authExample: "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    requestUrl: "/api/news/analyze",
    method: "POST",
    params: [
      { name: "text", type: "string", desc: "분석할 뉴스 본문 또는 텍스트" },
      { name: "symbol", type: "string", desc: "(선택) 종목 코드" }
    ],
    headerStructure: [
      { name: "Host", important: false },
      { name: "Origin", important: false },
      { name: "Referer", important: false },
      { name: "Authorization", important: true }
    ],
    bodyStructure: `{
  "text": "분석할 뉴스 본문 또는 텍스트",
  "symbol": "005930"
}`,
    requestExample: `POST /api/news/analyze\nContent-Type: application/json\nAuthorization: Bearer ...\n\n{\n  "text": "삼성전자, AI 반도체 신제품 출시...",\n  "symbol": "005930"\n}`,
    responseExample: `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  "sentiment": "positive",\n  "impact_score": 0.82,\n  "summary": "삼성전자가 AI 반도체 신제품을 출시했다는 긍정적 뉴스입니다.",\n  "symbol": "005930"\n}`,
    responseFields: [
      { name: "status_code", desc: "응답 상태 코드 (200: 성공, 400: 잘못된 요청, 401: 인증 실패 등)" },
      { name: "message", desc: "응답 메시지 (성공 또는 오류 설명)" },
      { name: "items", desc: "요청한 항목별 반환 배열" },
      { name: "event_type", desc: "요청한 이벤트 유형 (finance)" },
      { name: "result", desc: "분석 결과 (positive 또는 negative)" }
    ],
    usageInfo: {
      limit: "500건/일",
      price: "기본 무료 (추가 요청은 유료)",
      sla: "99.9% 가용성 보장",
      support: "이메일 지원 (평일 9AM-6PM)"
    },
    faqList: [
      { code: "401 Unauthorized", desc: "API 키가 유효하지 않거나 만료되었습니다. API 키를 확인하세요." },
      { code: "400 Bad Request", desc: "요청 형식이 올바르지 않습니다. 요청 파라미터를 확인하세요." },
      { code: "404 Not Found", desc: "요청한 종목 코드에 대한 데이터를 찾을 수 없습니다." },
      { code: "429 Too Many Requests", desc: "일일 요청 한도를 초과했습니다. 내일 다시 시도하거나 요금제를 업그레이드하세요." },
      { code: "500 Server Error", desc: "서버 오류가 발생했습니다. 잠시 후 다시 시도하거나 지원팀에 문의하세요." }
    ]
  },
  finance: {
    icon: "\uD83D\uDCCA",
    title: "AI 재무제표 분석 API",
    desc: "AI 재무제표 분석 API는 기업의 재무제표 데이터를 분석하여 재무 건전성, 성장성, 수익성 등을 평가하고 투자 결정에 도움이 되는 인사이트를 제공합니다. 머신러닝 알고리즘을 활용하여 기업의 미래 성과를 예측하고 투자 가치를 평가합니다.",
    features: [
      "재무 건전성 평가",
      "성장성 및 수익성 분석",
      "기업 가치 평가",
      "경쟁사 비교 분석"
    ],
    authExample: "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    requestUrl: "/api/finance/analyze",
    method: "POST",
    params: [
      { name: "corp_code", type: "string", desc: "분석할 기업의 고유 코드" },
      { name: "year", type: "number", desc: "분석 연도 (예: 2023)" }
    ],
    headerStructure: [
      { name: "Host", important: false },
      { name: "Origin", important: false },
      { name: "Referer", important: false },
      { name: "Authorization", important: true }
    ],
    bodyStructure: `{
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_SECRET",
  "items": [
    {
      "event_type": "finance",
      "data": {
        "balance_sheet": {
          "Current Assets": [],
          "Current Liabilities": [],
          "Cash And Cash Equivalents": [],
          "Accounts Receivable": [],
          "Cash Cash Equivalents And Short Term Investments": [],
          "Cash Equivalents": [],
          "Cash Financial": [],
          "Other Short Term Investments": [],
          "Stockholders Equity": [],
          "Total Assets": [],
          "Retained Earnings": [],
          "Inventory": []
        },
        "income_statement": {
          "Total Revenue": [],
          "Gross Profit": [],
          "Selling General And Administration": [],
          "Operating Income": [],
          "Other Non Operating Income Expenses": [],
          "Reconciled Depreciation": [],
          "EBITDA": []
        },
        "cash_flow": {
          "Operating Cash Flow": [],
          "Investing Cash Flow": [],
          "Capital Expenditure": []
        },
        "chart": {
          "timestamp": [],
          "v": [],
          "vw": [],
          "o": [],
          "c": [],
          "h": [],
          "l": [],
          "t": [],
          "n": []
        }
      }
    }
  ]
}`,
    requestExample: `POST /api/finance/analyze\nContent-Type: application/json\nAuthorization: Bearer ...\n\n{\n  "corp_code": "005930",\n  "year": 2023\n}`,
    responseExample: `HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  "corp_code": "005930",\n  "year": 2023,\n  "score": 92,\n  "grade": "A+",\n  "summary": "삼성전자의 2023년 재무 건전성은 매우 우수합니다."\n}`,
    responseFields: [
      { name: "status_code", desc: "응답 상태 코드 (200: 성공, 400: 잘못된 요청, 401: 인증 실패 등)" },
      { name: "message", desc: "응답 메시지 (성공 또는 오류 설명)" },
      { name: "items", desc: "요청한 항목별 반환 배열" },
      { name: "event_type", desc: "요청한 이벤트 유형 (finance)" },
      { name: "result", desc: "분석 결과 (positive 또는 negative)" }
    ],
    usageInfo: {
      limit: "500건/일",
      price: "기본 무료 (추가 요청은 유료)",
      sla: "99.9% 가용성 보장",
      support: "이메일 지원 (평일 9AM-6PM)"
    },
    faqList: [
      { code: "401 Unauthorized", desc: "API 키가 유효하지 않거나 만료되었습니다. API 키를 확인하세요." },
      { code: "400 Bad Request", desc: "요청 형식이 올바르지 않습니다. 요청 파라미터를 확인하세요." },
      { code: "404 Not Found", desc: "요청한 종목 코드에 대한 데이터를 찾을 수 없습니다." },
      { code: "429 Too Many Requests", desc: "일일 요청 한도를 초과했습니다. 내일 다시 시도하거나 요금제를 업그레이드하세요." },
      { code: "500 Server Error", desc: "서버 오류가 발생했습니다. 잠시 후 다시 시도하거나 지원팀에 문의하세요." }
    ]
  }
};

const ApiTabSection = () => {
  const [tab, setTab] = useState("finance");
  return (
    <div>
      <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
        <button
          style={{
            fontWeight: tab === "news" ? 700 : 500,
            color: tab === "news" ? "#0066e6" : "#222",
            borderBottom: tab === "news" ? "3px solid #0066e6" : "3px solid transparent",
            background: "none", border: "none", fontSize: 18, padding: "8px 0", cursor: "pointer"
          }}
          onClick={() => setTab("news")}
        >
          뉴스분석 API
        </button>
        <button
          style={{
            fontWeight: tab === "finance" ? 700 : 500,
            color: tab === "finance" ? "#0066e6" : "#222",
            borderBottom: tab === "finance" ? "3px solid #0066e6" : "3px solid transparent",
            background: "none", border: "none", fontSize: 18, padding: "8px 0", cursor: "pointer"
          }}
          onClick={() => setTab("finance")}
        >
          재무제표분석 API
        </button>
      </div>
      <ApiIntro {...apiData[tab]} />
      <ApiKeyGuide />
      <ApiAuthGuide example={apiData[tab].authExample} />
      <ApiRequestFormat
        requestUrl={apiData[tab].requestUrl}
        method={apiData[tab].method}
        params={apiData[tab].params}
        headerStructure={apiData[tab].headerStructure}
        bodyStructure={apiData[tab].bodyStructure}
        requestExample={apiData[tab].requestExample}
        responseExample={apiData[tab].responseExample}
        responseFields={apiData[tab].responseFields}
        usageInfo={apiData[tab].usageInfo}
        faqList={apiData[tab].faqList}
      />
    </div>
  );
};

export default ApiTabSection; 