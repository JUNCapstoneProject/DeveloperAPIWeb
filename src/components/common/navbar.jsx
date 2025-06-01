import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLoginStatus, setAccessToken, logout } from "../../redux/features/authSlice";  
import { selectIsLoggedIn } from "../../redux/features/authSelectors";
import { logoutAPI } from "../../redux/features/authAPI";

const Navbar = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleQuickLogin = (e) => {
    e.preventDefault();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    const success = await logoutAPI();
    if (success) {
      localStorage.removeItem('accessToken');
      dispatch(logout());
      setIsMenuOpen(false);
      alert('로그아웃 되었습니다.');
    } else {
      alert('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <NavbarWrapper>
      <Inner>
        <LogoBox to="/">
          <LogoImg src="/logo.svg" alt="투자인 로고" />
          <Brand>TUZAIN DEVELOPERS</Brand>
        </LogoBox>
        <Menu className={isMenuOpen ? 'open' : ''}>
          <CloseButton onClick={() => setIsMenuOpen(false)}>×</CloseButton>
          <MenuItem>
            <StyledLink to="/about" onClick={() => setIsMenuOpen(false)}>API 소개</StyledLink>
          </MenuItem>
          <MenuItem>
            <StyledLink to="/usage" onClick={() => setIsMenuOpen(false)}>API 사용하기</StyledLink>
          </MenuItem>
          <MenuItem>
            <StyledLink to="/apps" onClick={() => setIsMenuOpen(false)}>내 애플리케이션</StyledLink>
          </MenuItem>
          <MobileOnly>
            <MenuItem>
              <MenuLink onClick={() => {
                isLoggedIn ? navigate('/mypage') : navigate('/login');
                setIsMenuOpen(false);
              }}>
                마이페이지
              </MenuLink>
            </MenuItem>
            <MenuItem>
              {isLoggedIn ? (
                <MenuLink onClick={handleLogout}>
                  로그아웃
                </MenuLink>
              ) : (
                <MenuLink onClick={handleQuickLogin}>
                  로그인
                </MenuLink>
              )}
            </MenuItem>
          </MobileOnly>
        </Menu>
        <Actions>
          <DesktopOnly>
            <MyPageBtn onClick={() => isLoggedIn ? navigate('/mypage') : navigate('/login')}>
              <img src="/my.svg" alt="마이페이지" style={{ width: 32, height: 32, borderRadius: '50%' }} />
            </MyPageBtn>
            {isLoggedIn ? (
              <LoginBtn type="button" onClick={handleLogout}>
                로그아웃
              </LoginBtn>
            ) : (
              <LoginBtn type="button" onClick={handleQuickLogin}>
                로그인
              </LoginBtn>
            )}
          </DesktopOnly>
          <HamburgerButton 
            className={isMenuOpen ? 'open' : ''} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="메뉴"
          >
            <span></span>
            <span></span>
            <span></span>
          </HamburgerButton>
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
  flex-wrap: nowrap;
  min-width: 320px;

  @media (max-width: 845px) {
    padding: 0 16px;
  }
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
  white-space: nowrap;
  flex-shrink: 0;

  @media (max-width: 845px) {
    font-size: 18px;
  }
`;

const Menu = styled.ul`
  display: flex;
  gap: 36px;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-shrink: 0;

  @media (max-width: 845px) {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.98);
    flex-direction: column;
    padding: 80px 20px 20px;
    gap: 20px;
    z-index: 1000;
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.3s ease;

    &.open {
      display: flex;
      opacity: 1;
      transform: translateY(0);
    }
  }
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
  white-space: nowrap;
  &:hover {
    color: #0066e6;
  }

  @media (max-width: 845px) {
    font-size: 14px;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-shrink: 0;
  align-items: center;
`;

const LoginBtn = styled.button`
  color: #fff;
  background: #0066e6;
  border: 1.5px solid #0066e6;
  border-radius: 6px;
  padding: 7px 20px;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
  cursor: pointer;
  &:hover {
    background: #0055cc;
  }
`;

const MyPageBtn = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #222;
  font-size: 16px;
  font-weight: 500;

  span {
    @media (min-width: 769px) {
      display: none;
    }
  }

  &:hover {
    color: #0066e6;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  padding: 10px;
  cursor: pointer;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 24px;
  margin-left: 12px;

  @media (max-width: 845px) {
    display: flex;
  }

  span {
    display: block;
    width: 100%;
    height: 2px;
    background-color: #222;
    transition: all 0.3s ease;
  }

  &:hover span {
    background-color: #0066e6;
  }
`;

const DesktopOnly = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 845px) {
    display: none;
  }
`;

const MobileOnly = styled.div`
  display: none;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e8eb;

  @media (max-width: 845px) {
    display: flex;
  }
`;

const MenuLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  color: #222;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  width: 100%;

  &:hover {
    color: #0066e6;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 32px;
  color: #222;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #0066e6;
  }

  @media (min-width: 769px) {
    display: none;
  }
`;
