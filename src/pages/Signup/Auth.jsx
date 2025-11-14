import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { c, typography } from '../../styles/themeUtils';
import PageHeader from '../../components/PageHeader';
import SignUpTitle from '../../components/Signup/SignUpTitle';
import NavButton from '../../components/Signup/NavButton';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-bottom: 100px;
`;

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 16px;
`;

const AuthInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const AuthInputContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

const AuthInput = styled.input`
  width: 100%;
  padding: 12px 80px 12px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${c('neutral.gray')};
  background: ${c('neutral.white')};
  ${typography('body01')};
  color: ${c('neutral.black')};
  line-height: 24px;
  box-sizing: border-box;
  outline: none;

  &::placeholder {
    color: ${c('neutral.gray2')};
  }

  &:focus {
    border-color: ${c('brand.pink')};
  }
`;

const Timer = styled.span`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  ${typography('body01')};
  color: ${c('brand.pink')};
  user-select: none;
`;

const HelperText = styled.span`
  ${typography('body01')};
  color: rgba(44, 50, 73, 0.5);
  line-height: normal;
  padding-left: 4px;
`;

const ResendLink = styled.button`
  ${typography('body02')};
  color: ${c('brand.pink')};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  text-align: center;
  margin-top: 4px;
  width: 100%;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }

  &:active {
    opacity: 0.5;
  }
`;

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [formData, setFormData] = useState({
    auth: '',
  });
  
  const [timeLeft, setTimeLeft] = useState(180); // 3분 = 180초

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleBack = () => {
    navigate('/signup/password');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // 숫자만 입력되도록 제한 (최대 6자리)
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 6);
    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const handleResend = () => {
    // TODO: 인증번호 재전송 로직 구현
    setTimeLeft(180); // 3분으로 리셋
    setFormData({ auth: '' }); // 입력 필드 초기화
  };

  const isAllFieldsFilled = formData.auth.trim().length === 6;

  const handleSubmit = () => {
    if (isAllFieldsFilled) {
      // TODO: 비밀번호 찾기 로직 구현
      navigate('/signup/newpassword');
    }
  };

  return (
    <Container>
      <ContentWrapper>
        <PageHeader title="비밀번호 찾기" onBack={handleBack} />
        <SignUpTitle 
          title={
            <>
              이메일로 전송된<br />
              인증번호를 입력해주세요.
            </>
          }
        />
        <FieldsContainer>
          <AuthInputWrapper>
            <AuthInputContainer>
              <AuthInput
                name="auth"
                placeholder="인증번호 6자리"
                value={formData.auth}
                onChange={handleChange}
                maxLength={6}
                type="text"
                inputMode="numeric"
              />
              {timeLeft > 0 && <Timer>{formatTime(timeLeft)}</Timer>}
            </AuthInputContainer>
            {email && (
              <HelperText>{`"${email}으로 인증번호를 보냈습니다."`}</HelperText>
            )}
            <ResendLink onClick={handleResend}>인증번호 재전송</ResendLink>
          </AuthInputWrapper>
        </FieldsContainer>
      </ContentWrapper>
      <NavButton isActive={isAllFieldsFilled} onClick={handleSubmit}>인증하기</NavButton>
    </Container>
  );
}