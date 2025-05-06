import React from "react";
import styled from "styled-components";

const HomeCard = ({ icon, title, desc, list, buttonText, onButtonClick }) => {
  return (
    <CardWrapper>
      <IconBox>{icon}</IconBox>
      <CardTitle>{title}</CardTitle>
      <CardDesc>
        {desc}
        {list && (
          <ul>
            {list.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
      </CardDesc>
      <CardButton onClick={onButtonClick}>{buttonText}</CardButton>
    </CardWrapper>
  );
};

export default HomeCard;

// styled-components
const CardWrapper = styled.div`
  background: #fff;
  border: 1.5px solid #e5e8eb;
  border-radius: 12px;
  box-shadow: 0 2px 8px 0 rgba(16, 30, 54, 0.04);
  padding: 32px 28px 24px 28px;
  width: 340px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const IconBox = styled.div`
  margin-bottom: 12px;
`;

const CardTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #222;
  margin-bottom: 10px;
`;

const CardDesc = styled.div`
  font-size: 15px;
  color: #222;
  margin-bottom: 18px;
  ul {
    margin: 10px 0 0 0;
    padding-left: 18px;
    color: #222;
    font-size: 15px;
  }
  li {
    margin-bottom: 4px;
  }
`;

const CardButton = styled.button`
  margin-top: auto;
  width: 100%;
  background: #0066e6;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 0;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #0053b3;
  }
`;
