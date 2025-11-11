import { useState } from 'react';
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
import avatar1 from '../../assets/icons/profile/avatar1.svg';
import avatar2 from '../../assets/icons/profile/avatar2.svg';
import avatar3 from '../../assets/icons/profile/avatar3.svg';
import avatar4 from '../../assets/icons/profile/avatar4.svg';
import avatar5 from '../../assets/icons/profile/avatar5.svg';
import { loginUser, createGuestAccount } from '../../api/authService';

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isGuestSubmitting, setIsGuestSubmitting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!isAllFieldsFilled || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        email: formData.email.trim(),
        password: formData.password,
      };

      const response = await loginUser(payload);

      const userEmail = response?.email || payload.email;
      const userNickname = response?.nickname || localStorage.getItem('nickname') || '';
      const profileImageUrl = response?.profileImageUrl || localStorage.getItem('userProfileImage') || '';
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

      localStorage.setItem('userPassword', payload.password);

      if (response?.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
      }
      if (response?.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }

      navigate('/festival');
    } catch (error) {
      const message =
        error?.data?.message || error?.message || '이메일 또는 비밀번호가 올바르지 않습니다.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const adjectives = [
    '멋진',
    '귀여운',
    '행복한',
    '빛나는',
    '용감한',
    '똑똑한',
    '친절한',
    '활발한',
    '차분한',
    '밝은',
    '강한',
    '부드러운',
    '따뜻한',
    '시원한',
    '신비로운',
    '재미있는',
  ];

  const nouns = [
    '고양이',
    '강아지',
    '토끼',
    '햄스터',
    '다람쥐',
    '팬더',
    '곰',
    '펭귄',
    '돌고래',
    '나비',
    '별',
    '달',
    '구름',
    '바람',
    '물결',
    '꽃',
    '나무',
    '산',
    '바다',
    '하늘',
    '별빛',
    '햇살',
    '달빛',
    '무지개',
    '눈멍이',
  ];

  const avatarPool = [avatar1, avatar2, avatar3, avatar4, avatar5];

  const generateRandomNickname = () => {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adjective} ${noun}`;
  };

  const getRandomAvatar = () => {
    const randomIndex = Math.floor(Math.random() * avatarPool.length);
    return avatarPool[randomIndex];
  };

  const getSlugForGuest = () => {
    const storedSlug = (() => {
      try {
        return localStorage.getItem('userSlug');
      } catch {
        return null;
      }
    })();
    return storedSlug || 'plink2025';
  };

  const createFileFromAsset = async assetUrl => {
    try {
      const response = await fetch(assetUrl);
      const blob = await response.blob();
      const extension = assetUrl.split('.').pop()?.split('?')[0] || 'svg';
      const fileName = `guest-avatar-${Date.now()}.${extension}`;
      const type = blob.type || `image/${extension}`;
      return new File([blob], fileName, { type });
    } catch (error) {
      console.error('게스트 아바타 파일 생성 실패', error);
      return null;
    }
  };

  const handleGuestLogin = async () => {
    if (isGuestSubmitting) {
      return;
    }

    setIsGuestSubmitting(true);

    try {
      const nickname = generateRandomNickname();
      const slug = getSlugForGuest();
      const avatarUrl = getRandomAvatar();
      const avatarFile = await createFileFromAsset(avatarUrl);

      const response = await createGuestAccount({
        nickname,
        slug,
        profileImageFile: avatarFile,
      });

      const guestEmail = response?.email || `guest-${Date.now()}`;
      const guestNickname = response?.nickname || nickname;
      const profileImageUrl = response?.profileImageUrl || avatarUrl || '';
      const role = response?.role || 'GUEST';
      const responseSlug = response?.slug || slug;

      localStorage.setItem('userId', guestEmail);
      localStorage.setItem('nickname', guestNickname);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userSlug', responseSlug);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('isGuest', 'true');

      if (profileImageUrl) {
        localStorage.setItem('userProfileImage', profileImageUrl);
      }

      setErrorMessage('');
      navigate('/festival');
    } catch (error) {
      const message =
        error?.data?.message || error?.message || '게스트 입장에 실패했습니다. 다시 시도해주세요.';
      setErrorMessage(message);
    } finally {
      setIsGuestSubmitting(false);
    }
  };

  const handleSignUp = e => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/signup/nickname');
  };

  const handleFindPassword = e => {
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
          <LoginTitle>PLINK에 오신 것을 환영합니다!</LoginTitle>
        </LoginTitleContainer>
        <FieldsContainer>
          <TextField
            name="email"
            placeholder="이메일"
            value={formData.email}
            onChange={handleChange}
            type="email"
          />
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
        </FieldsContainer>
        <LoginButtonContainer>
          <LoginButton
            isActive={isAllFieldsFilled && !isSubmitting}
            onClick={handleLogin}
            disabled={!isAllFieldsFilled || isSubmitting}
          >
            {isSubmitting ? '로그인 중...' : '입장하기'}
          </LoginButton>
        </LoginButtonContainer>
        <LinkContainer>
          <LinkText onClick={handleSignUp}>회원가입</LinkText>
          <Separator>ㅣ</Separator>
          <LinkText onClick={handleFindPassword}>비밀번호 찾기</LinkText>
        </LinkContainer>
        <CircleImg src={Purple} bottom="-340px" right="10px" />
        <CircleImg src={Pink} bottom="-320px" left="130px" />
      </Container>
      <LoginNavButton
        onClick={handleGuestLogin}
        disabled={isGuestSubmitting}
      >
        {isGuestSubmitting ? '게스트 입장 중...' : '로그인 없이 입장하기'}
      </LoginNavButton>
    </>
  );
}


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

const CircleImg = styled.img`
  position: absolute;
  z-index: -1;
  top: ${({ top }) => top || 'auto'};
  left: ${({ left }) => left || 'auto'};
  right: ${({ right }) => right || 'auto'};
  bottom: ${({ bottom }) => bottom || 'auto'};
`;