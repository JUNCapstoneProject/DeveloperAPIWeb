import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <NavbarWrapper>
      <Inner>
        <LogoBox to="/">
          <LogoImg src="/logo.svg" alt="투자인 로고" />
          <Brand>TUZAIN DEVELOPERS</Brand>
        </LogoBox>
        <Menu>
          <MenuItem>
            <StyledLink to="/about">API 소개</StyledLink>
          </MenuItem>
          <MenuItem>
            <StyledLink to="/usage">API 사용하기</StyledLink>
          </MenuItem>
          <MenuItem>
            <StyledLink to="/apps">내 애플리케이션</StyledLink>
          </MenuItem>
        </Menu>
        <Actions>
          <LoginBtn to="/login">로그인</LoginBtn>
          <SignupBtn to="/signup">회원가입</SignupBtn>
        </Actions>
      </Inner>
    </NavbarWrapper>
  );
};

export default Navbar;

// styled-components
const NavbarWrapper = styled.nav`
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #e5e8eb;
  box-shadow: 0 1px 4px 0 rgba(16, 30, 54, 0.04);
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
`;

const LogoBox = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
`;

const LogoImg = styled.img`
  height: 32px;
`;

const Brand = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: #222;
  letter-spacing: -1px;
`;

const Menu = styled.ul`
  display: flex;
  gap: 36px;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const MenuItem = styled.li`
  display: flex;
  align-items: center;
`;

const StyledLink = styled(Link)`
  color: #222;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
  &:hover {
    color: #0066e6;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
`;

const LoginBtn = styled(Link)`
  color: #0066e6;
  background: #fff;
  border: 1.5px solid #0066e6;
  border-radius: 6px;
  padding: 7px 20px;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #f0f6ff;
  }
`;

const SignupBtn = styled(Link)`
  color: #fff;
  background: #0066e6;
  border-radius: 6px;
  padding: 7px 20px;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  border: none;
  transition: background 0.2s;
  &:hover {
    background: #0053b3;
  }
`;
