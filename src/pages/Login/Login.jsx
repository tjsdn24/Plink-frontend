import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { c, typography } from '../../styles/themeUtils';
import LogoHeader from '../../components/LogoHeader';
import TextField from '../../components/Signup/TextField';
import LoginButton from '../../components/Login/LoginButton';
import LoginNavButton from '../../components/Login/NavButton';
import Pink from '../../assets/icons/LoginPink.svg';
import Purple from '../../assets/icons/LoginPurple.svg';
import EyeOpen from '../../assets/icons/EyeOpen.svg';
import EyeClosed from '../../assets/icons/EyeClosed.svg';
import { loginUser } from '../../api/authService';
import { isGuestSession, getStoredNickname, getStoredSlug } from '../../utils/guestSession';

export default function Login() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const loginButtonRef = useRef(null);
  const navButtonRef = useRef(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const isAllFieldsFilled = formData.email.trim() !== '' && formData.password.trim() !== '';

  const handleLogin = async () => {
    if (!isAllFieldsFilled) {
      return;
    }

    try {
      const payload = {
        email: formData.email.trim(),
        password: formData.password,
      };

      const response = await loginUser(payload);

      const userEmail = response?.email || payload.email;
      const userNickname = response?.nickname || '';
      const profileImageUrl = response?.profileImageUrl || '';
      const role = response?.role || '';
      const slug = response?.slug || '';

      localStorage.setItem('userId', userEmail);
      localStorage.setItem('isLoggedIn', 'true');

      if (userNickname) {
        localStorage.setItem('nickname', userNickname);
      }
      if (profileImageUrl) {
        localStorage.setItem('userProfileImage', profileImageUrl);
      }
      if (role) {
        localStorage.setItem('userRole', role);
      }
      if (slug) {
        localStorage.setItem('userSlug', slug);
      }

      navigate('/festival');
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.data?.message || error?.message || '이메일 또는 비밀번호가 올바르지 않습니다.';
      setErrorMessage(message);
    }
  };

  const handleGuestLogin = () => {
    navigate('/festival', {
      state: {
        guest: true,
        slug: 'line4thon',
      },
    });
  };

  const handleSignUp = e => {
    e.preventDefault();
    e.stopPropagation();
    
    // 백엔드 로직: upgradeGuestToUser에서 게스트의 UserFestival을 새 User로 소유권 변경
    // 게스트 닉네임을 그대로 사용하면 백엔드에서 통과 (festival.getNickname().equals(newNickname))
    if (isGuestSession()) {
      const nickname = getStoredNickname();
      const slug = getStoredSlug();

      // 게스트 로그인 시 사용한 닉네임을 기본값으로 사용
      // 사용자가 원하면 닉네임 선택 페이지에서 변경 가능
      navigate('/signup/nickname', {
        state: {
          nickname: nickname || '숨쉬는 고양이',
          slug: slug || 'line4thon',
          fromGuest: true,
        },
      });
      return;
    }
    
    navigate('/signup/nickname');
  };

  const handleFindPassword = e => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/signup/password');
  };

  // 키보드 높이 감지 및 버튼 위치 조정
  useEffect(() => {
    const handleResize = () => {
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const windowHeight = window.innerHeight;
      const keyboardHeight = windowHeight - viewportHeight;
      
      if (keyboardHeight > 0) {
        // 키보드가 올라온 경우
        setKeyboardHeight(keyboardHeight);
      } else {
        // 키보드가 내려간 경우
        setKeyboardHeight(0);
      }
    };

    const handleFocus = () => {
      // 키보드가 올라올 때를 대비해 약간의 지연 후 스크롤
      setTimeout(() => {
        if (loginButtonRef.current && containerRef.current) {
          loginButtonRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'end',
            inline: 'nearest'
          });
        }
        handleResize();
      }, 300);
    };

    const handleBlur = () => {
      setTimeout(() => {
        handleResize();
      }, 300);
    };

    // Visual Viewport API 사용 (모바일 브라우저)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    } else {
      window.addEventListener('resize', handleResize);
    }

    const emailInput = document.querySelector('input[name="email"]');
    const passwordInput = document.querySelector('input[name="password"]');

    if (emailInput) {
      emailInput.addEventListener('focus', handleFocus);
      emailInput.addEventListener('blur', handleBlur);
    }
    if (passwordInput) {
      passwordInput.addEventListener('focus', handleFocus);
      passwordInput.addEventListener('blur', handleBlur);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      } else {
        window.removeEventListener('resize', handleResize);
      }
      if (emailInput) {
        emailInput.removeEventListener('focus', handleFocus);
        emailInput.removeEventListener('blur', handleBlur);
      }
      if (passwordInput) {
        passwordInput.removeEventListener('focus', handleFocus);
        passwordInput.removeEventListener('blur', handleBlur);
      }
    };
  }, []);

  return (
    <Container ref={containerRef}>
      <ContentWrapper>
        <LogoHeaderContainer>
          <LogoHeader />
        </LogoHeaderContainer>
        <LoginTitleContainer>
          <LoginTitle>PLINK에 오신 것을 환영합니다!</LoginTitle>
        </LoginTitleContainer>
        <FieldsContainer>
          <TextFieldWrapper>
            <TextField
              name="email"
              placeholder="이메일"
              value={formData.email}
              onChange={handleChange}
              type="email"
            />
          </TextFieldWrapper>
          <TextFieldWrapper>
            <TextField
              name="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleChange}
              type={showPassword ? 'text' : 'password'}
              icon={showPassword ? EyeOpen : EyeClosed}
              onIconClick={() => setShowPassword(prev => !prev)}
              helperText={errorMessage || undefined}
            />
          </TextFieldWrapper>
        </FieldsContainer>
        <LoginButtonContainer ref={loginButtonRef}>
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
        <CircleImg src={Purple} bottom="-340px" right="10px" />
        <CircleImg src={Pink} bottom="-320px" left="130px" />
      </ContentWrapper>
      <LoginNavButton ref={navButtonRef} $keyboardHeight={keyboardHeight} onClick={handleGuestLogin}>로그인 없이 입장하기</LoginNavButton>
    </Container>
  );
}


const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  padding: 0;
  box-sizing: border-box;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 0 16px;
  padding-bottom: clamp(60px, 10vh, 100px);
  box-sizing: border-box;
  gap: clamp(12px, 2.5vh, 20px);
`;

const LogoHeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin-top: clamp(24px, 6vh, 64px);
  margin-bottom: 0;
  flex-shrink: 0;
  min-height: fit-content;

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
  padding: clamp(8px, 1.5vh, 16px) 0;
  margin: 0;
  box-sizing: border-box;
  width: 100%;
  flex-shrink: 0;
  min-height: fit-content;
`;

const LoginTitle = styled.h2`
  ${typography('display01')};
  color: ${c('neutral.black')};
  line-height: 1.2;
  margin: 0;
  text-align: center;
  font-size: clamp(20px, 4vw, 24px);
`;

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 2vh, 16px);
  margin: 0;
  padding: 0;
  width: 100%;
  flex-shrink: 0;
  min-height: fit-content;
`;

const TextFieldWrapper = styled.div`
  width: 100%;
  
  > div {
    padding: 0 !important;
  }
`;

const LoginButtonContainer = styled.div`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  width: 100%;
  flex-shrink: 0;
  min-height: fit-content;
`;

const LinkContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  width: 100%;
  position: relative;
  z-index: 10;
  flex-shrink: 0;
  min-height: fit-content;
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

const CircleImg = styled.img`
  position: absolute;
  z-index: -1;
  top: ${({ top }) => top || 'auto'};
  left: ${({ left }) => left || 'auto'};
  right: ${({ right }) => right || 'auto'};
  bottom: ${({ bottom }) => bottom || 'auto'};
`;