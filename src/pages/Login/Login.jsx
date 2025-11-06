import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { c, typography } from '../../styles/themeUtils';
import LogoHeader from '../../components/LogoHeader';
import TextField from '../../components/Signup/TextField';
import LoginButton from '../../components/Login/LoginButton';
import LoginNavButton from '../../components/Login/NavButton';
import NavCircle1 from '../../assets/icons/LoginPink.svg';
import NavCircle2 from '../../assets/icons/LoginPurple.svg';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100vh;
  overflow: hidden;
  padding-bottom: 0px;
  position: relative;
`;

const LogoHeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
  margin-top: 64px;
  margin-bottom: 54px;

  > header {
    width: 100%;
    justify-content: center !important;
    
    h1 {
      width: 100%;
      text-align: center;
    }
  }
`;

const LoginTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md} 16px;
  margin-bottom: 32px;
  margin-top: 0;
  box-sizing: border-box;
  width: 100%;
`;

const LoginTitle = styled.h2`
  ${typography('display01')};
  color: ${c('neutral.black')};
  line-height: 1.2;
  margin: 0;
  text-align: center;
`;

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
`;

const LoginButtonContainer = styled.div`
  padding: 0 16px;
  margin-top: 24px;
  margin-bottom: 24px;
  box-sizing: border-box;
  width: 100%;
`;

const LinkContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  padding: 0 16px;
  margin-top: -14px;
  margin-bottom: 24px;
  box-sizing: border-box;
  width: 100%;
  position: relative;
  z-index: 10;
`;

const LinkText = styled.button`
  ${typography('body02')};
  color: ${c('neutral.black2')};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-decoration: none;
  transition: opacity 0.2s ease;
  position: relative;
  z-index: 11;
  pointer-events: auto;

  &:hover {
    opacity: 0.7;
  }

  &:active {
    opacity: 0.5;
  }
`;

const Separator = styled.span`
  ${typography('body02')};
  color: ${c('neutral.black2')};
  user-select: none;
`;

const NavCircle1Container = styled.div`
  position: absolute;
  top: 60%;
  transform: translateY(0%);
  left: 0;
  z-index: 1;
  pointer-events: none;
`;

const NavCircle2Container = styled.div`
  position: absolute;
  top: 60%;
  transform: translateY(0%);
  right: -15%;
  z-index: 1;
  pointer-events: none;
`;

export default function Login() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isAllFieldsFilled =
    formData.email.trim() !== '' &&
    formData.password.trim() !== '';

  const handleLogin = () => {
    if (isAllFieldsFilled) {
      navigate('/');
    }
  };

  const handleGuestLogin = () => {
    navigate('/');
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/signup/nickname');
  };

  const handleFindPassword = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/signup/password');
  };

  return (
    <>
      <Container>
        <LogoHeaderContainer>
          <LogoHeader />
        </LogoHeaderContainer>
        <LoginTitleContainer>
          <LoginTitle>
            축제를 즐길 준비가
            되셨나요?
          </LoginTitle>
        </LoginTitleContainer>
        <FieldsContainer>
          <TextField
            name="email"
            placeholder="이메일"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
          />
        </FieldsContainer>
        <LoginButtonContainer>
          <LoginButton 
            isActive={isAllFieldsFilled} 
            onClick={handleLogin}
            disabled={!isAllFieldsFilled}
          >
            입장하기
          </LoginButton>
        </LoginButtonContainer>
        <LinkContainer>
          <LinkText onClick={handleSignUp}>회원가입</LinkText>
          <Separator>ㅣ</Separator>
          <LinkText onClick={handleFindPassword}>비밀번호 찾기</LinkText>
        </LinkContainer>
        <NavCircle1Container>
          <img src={NavCircle1} alt="" />
        </NavCircle1Container>
        <NavCircle2Container>
          <img src={NavCircle2} alt="" />
        </NavCircle2Container>
      </Container>
      <LoginNavButton onClick={handleGuestLogin}>로그인 없이 입장하기</LoginNavButton>
    </>
  );
}
