import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import PageHeader from '../../components/PageHeader';
import TextField from '../../components/Signup/TextField';
import SignUpTitle from '../../components/Signup/SignUpTitle';
import NavButton from '../../components/Signup/NavButton';
import EyeOpen from '../../assets/icons/EyeOpen.svg';
import EyeClosed from '../../assets/icons/EyeClosed.svg';
import avatar1 from '../../assets/icons/profile/avatar1.svg';
import avatar2 from '../../assets/icons/profile/avatar2.svg';
import avatar3 from '../../assets/icons/profile/avatar3.svg';
import avatar4 from '../../assets/icons/profile/avatar4.svg';
import avatar5 from '../../assets/icons/profile/avatar5.svg';
import { getStoredNickname, getStoredSlug } from '../../utils/guestSession';

const avatarPool = [avatar1, avatar2, avatar3, avatar4, avatar5];

const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * avatarPool.length);
  return avatarPool[randomIndex];
};

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
`;

export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromGuest = location.state?.fromGuest === true;
  const nicknameFromState = typeof location.state?.nickname === 'string' ? location.state.nickname : '';
  const nicknameCandidate = nicknameFromState || (fromGuest ? getStoredNickname() : '');
  const nickname = nicknameCandidate || '숨쉬는 고양이';
  const slugFromState = typeof location.state?.slug === 'string' ? location.state.slug : null;
  const slug = slugFromState || getStoredSlug('line4thon');
  // 게스트 로그인 후 회원가입 시 이메일 필드는 비워둠 (사용자가 직접 입력)
  const initialEmail = '';

  
  const [formData, setFormData] = useState(() => ({
    email: initialEmail,
    password: '',
    passwordConfirm: '',
  }));
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const passwordMismatch =
    formData.passwordConfirm.trim() !== '' &&
    formData.password.trim() !== '' &&
    formData.password !== formData.passwordConfirm;

  const isAllFieldsFilled =
    formData.email.trim() !== '' &&
    formData.password.trim() !== '' &&
    formData.passwordConfirm.trim() !== '' &&
    formData.password === formData.passwordConfirm;

  const handleBack = () => {
    if (fromGuest) {
      navigate('/login');
      return;
    }
    navigate('/signup/nickname');
  };

  const handleSubmit = async () => {
    if (!isAllFieldsFilled) {
      return;
    }
    navigate('/signup/complete', {
      state: {
        nickname,
        formData: {
          email: formData.email.trim(),
          password: formData.password,
          passwordConfirm: formData.passwordConfirm,
        },
        randomAvatar: getRandomAvatar(),
        slug,
        fromGuest,
      },
    });
  };

  return (
    <Container>
      <ContentWrapper>
        <PageHeader title="회원가입" onBack={handleBack} />
        <SignUpTitle userName={nickname} />
        <FieldsContainer>
          <TextField
            name="email"
            placeholder="이메일 입력"
            helperText="이메일 주소를 입력해주세요."
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            name="password"
            placeholder="비밀번호 입력"
            helperText="영문/숫자/특수문자로 8자 이상 적어주세요."
            value={formData.password}
            onChange={handleChange}
            type={showPassword ? 'text' : 'password'}
            icon={showPassword ? EyeOpen : EyeClosed}
            onIconClick={() => setShowPassword(prev => !prev)}
          />
          <TextField
            name="passwordConfirm"
            placeholder="비밀번호 확인"
            helperText={
              passwordMismatch
                ? '비밀번호가 일치하지 않습니다.'
                : '비밀번호를 다시 입력해주세요.'
            }
            value={formData.passwordConfirm}
            onChange={handleChange}
            type={showPasswordConfirm ? 'text' : 'password'}
            icon={showPasswordConfirm ? EyeOpen : EyeClosed}
            onIconClick={() => setShowPasswordConfirm(prev => !prev)}
          />
        </FieldsContainer>
      </ContentWrapper>
      <NavButton isActive={isAllFieldsFilled} onClick={handleSubmit}>가입하기</NavButton>
    </Container>
  );
}
