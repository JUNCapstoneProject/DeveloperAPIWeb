import React from "react";
import ExplainHeader from "../components/explain/ExplainHeader";
import ApiTabSection from "../components/explain/ApiTabSection";

const Explain = () => {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 32px 0 32px" }}>
      <ExplainHeader />
      <ApiTabSection />
    </div>
  );
};

export default Explain;
