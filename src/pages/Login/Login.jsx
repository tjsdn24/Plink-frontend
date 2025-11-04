import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { c, typography } from '../../styles/themeUtils';
import LogoHeader from '../../components/LogoHeader';
import TextField from '../../components/Signup/TextField';
import LoginButton from '../../components/Login/LoginButton';
import LoginNavButton from '../../components/Login/NavButton';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: 120px;
`;

const LogoHeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
  margin-top: 168px;
  margin-bottom: 0;

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
  margin-bottom: 24px;
  margin-top: 0;
  box-sizing: border-box;
  width: 100%;
`;

const LoginTitle = styled.h2`
  ${typography('display02')};
  color: ${c('neutral.black')};
  line-height: 1.2;
  margin: 0;
  text-align: center;
`;

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

const LoginButtonContainer = styled.div`
  padding: 0 16px;
  margin-top: 16px;
  margin-bottom: 24px;
  box-sizing: border-box;
  width: 100%;
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

  return (
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
      <LoginNavButton onClick={handleGuestLogin}>로그인 없이 입장하기</LoginNavButton>
    </Container>
  );
}
