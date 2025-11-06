import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { s } from '../../styles/themeUtils';
import SuccessEmojiIcon from '../../assets/icons/SuccessEmoji.svg';
import PageHeader from '../../components/PageHeader';
import SignUpTitle from '../../components/Signup/SignUpTitle';
import TextField from '../../components/Signup/TextField';
import BottomSheet from '../../components/Modal/BottomSheet';
import styled from 'styled-components';

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

export default function NewComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const nickname = location.state?.nickname || '숨쉬는 고양이';
  const formData = useMemo(() => location.state?.formData || {
    email: '',
    password: '',
    passwordConfirm: '',
  }, [location.state?.formData]);

  const handleLogin = () => {
    navigate('/login');
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
              value={formData.email}
              onChange={() => {}}
              disabled
            />
            <TextField
              name="password"
              placeholder="비밀번호 입력"
              helperText="비밀번호를 입력해주세요."
              value={formData.password}
              onChange={() => {}}
              disabled
            />
            <TextField
              name="passwordConfirm"
              placeholder="비밀번호 확인"
              helperText="영문/숫자/특수문자로 8자 이상 적어주세요."
              value={formData.passwordConfirm}
              onChange={() => {}}
              disabled
            />
          </FieldsContainer>
        </StyledFields>
      </>
    ),
    [nickname, formData]
  );

  return (
    <BottomSheet
      title="비밀번호 찾기"
      emojiIcon={SuccessEmojiIcon}
      emojiAlt="비밀번호 변경 완료"
      mainMessage="비밀번호 변경이 완료되었어요!"
      subMessages={[
        '변경된 비밀번호로 로그인 후',
        "'PLINK'를 즐겨보세요!",
      ]}
      buttonText="로그인하기"
      onButtonClick={handleLogin}
      backgroundContent={backgroundContent}
    />
  );
}
