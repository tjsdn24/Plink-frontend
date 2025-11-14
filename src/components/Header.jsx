import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { c, f, s } from '../styles/themeUtils';
import Login from '../pages/Login/Login';
import avatarImg from '../assets/icons/HeaderAvatar.svg';

const Bar = styled.header`
  height: 60px;
  background: ${c('neutral.bg')};
  padding: ${s('md')};
  font-family: ${f('family.display01')};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const LoginWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
`;
const Logo = styled.h1`
  font-size: 24px;
  color: ${c('brand.pink')};
`;
const LoginButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: ${f('family.display01')};
`;

export default function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };

    // 다른 탭에서의 localStorage 변경 감지
    window.addEventListener('storage', handleStorageChange);
    
    // 컴포넌트 마운트 시 및 로그인 후 상태 확인
    const checkLoginStatus = () => {
      const currentStatus = localStorage.getItem('isLoggedIn') === 'true';
      if (currentStatus !== isLoggedIn) {
        setIsLoggedIn(currentStatus);
      }
    };

    // 초기 확인
    checkLoginStatus();

    // 주기적으로 로그인 상태 확인 (같은 탭에서의 변경 감지)
    const interval = setInterval(checkLoginStatus, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [isLoggedIn]);

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <Bar>
      <Logo> PLINK</Logo>
      {!isLoggedIn && (
        <LoginWrapper>
          <LoginButton onClick={handleLoginClick}>로그인이 필요합니다</LoginButton>
          <img src={avatarImg} alt="아바타 아이콘" />
        </LoginWrapper>
      )}
    </Bar>
  );
}
