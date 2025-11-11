import { useMemo, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { s } from '../../styles/themeUtils';
import SuccessEmojiIcon from '../../assets/icons/SuccessEmoji.svg';
import PageHeader from '../../components/PageHeader';
import SignUpTitle from '../../components/Signup/SignUpTitle';
import TextField from '../../components/Signup/TextField';
import BottomSheet from '../../components/Modal/BottomSheet';
import styled from 'styled-components';
import { signupUser } from '../../api/authService';

const StyledHeader = styled.div``;

const StyledTitle = styled.div``;

const StyledFields = styled.div`
  padding: 0 ${s('md')};
`;

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: ${s('lg')};
`;

export default function SignUpComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = location.state ?? {};

  const nickname = routeState.nickname || '숨쉬는 고양이';
  const randomAvatar = routeState.randomAvatar || '';
  const slug = routeState.slug || 'plink2025';
  const formData = useMemo(
    () =>
      routeState.formData || {
        email: '',
        password: '',
        passwordConfirm: '',
      },
    [routeState.formData]
  );

  const [signupResult, setSignupResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!routeState.formData) {
      navigate('/signup/nickname', { replace: true });
    }
  }, [routeState.formData, navigate]);

  const resolvedEmail = signupResult?.email || formData.email || '';
  const resolvedPassword = formData.password || '';
  const resolvedPasswordConfirm = formData.passwordConfirm || '';

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const signupResponse = await signupUser({
        email: formData.email.trim(),
        password: formData.password,
        nickname,
        slug,
      });

      setSignupResult(signupResponse);

      localStorage.setItem('nickname', signupResponse?.nickname || nickname);
      localStorage.setItem('userId', formData.email.trim());
      localStorage.setItem('userPassword', formData.password);

      const profileImageUrl = signupResponse?.profileImageUrl || randomAvatar || '';
      if (profileImageUrl) {
        localStorage.setItem('userProfileImage', profileImageUrl);
      }

      const role = signupResponse?.role || 'USER';
      localStorage.setItem('userRole', role);

      const slugToPersist = signupResponse?.slug || slug || '';
      localStorage.setItem('userSlug', slugToPersist);

      handleLogin();
    } catch (error) {
      const message =
        error?.data?.message || error?.message || '회원가입에 실패했습니다. 다시 시도해주세요.';
      console.error(message, error);
      window.alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 배경 콘텐츠를 메모이제이션하여 불필요한 리렌더링 방지
  const backgroundContent = useMemo(
    () => (
      <>
        <StyledHeader>
          <PageHeader title="회원가입" />
        </StyledHeader>
        <StyledTitle>
          <SignUpTitle userName={nickname} />
        </StyledTitle>
        <StyledFields>
          <FieldsContainer>
            <TextField
              name="email"
              placeholder="이메일 입력"
              helperText="이메일을 입력해주세요."
              value={resolvedEmail}
              onChange={() => {}}
              disabled
            />
            <TextField
              name="password"
              placeholder="비밀번호 입력"
              helperText="비밀번호를 입력해주세요."
              value={resolvedPassword}
              onChange={() => {}}
              disabled
            />
            <TextField
              name="passwordConfirm"
              placeholder="비밀번호 확인"
              helperText="영문/숫자/특수문자로 8자 이상 적어주세요."
              value={resolvedPasswordConfirm}
              onChange={() => {}}
              disabled
            />
          </FieldsContainer>
        </StyledFields>
      </>
    ),
    [nickname, resolvedEmail, resolvedPassword, resolvedPasswordConfirm]
  );

  return (
    <BottomSheet
      title="회원가입"
      emojiIcon={SuccessEmojiIcon}
      emojiAlt="회원가입 완료"
      mainMessage="회원가입이 완료되었어요!"
      subMessages={[
        '서비스에 가입해주셔서 감사합니다',
        "즐거운 'PLINK'되세요!",
      ]}
      subMessagesAlign="center"
      subMessagesTextAlign="center"
      buttonText={isSubmitting ? '가입 중...' : '로그인하기'}
      onButtonClick={handleRegister}
      buttonDisabled={isSubmitting}
      backgroundContent={backgroundContent}
    />
  );
}
