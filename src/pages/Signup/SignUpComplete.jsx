import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { c, s, typography } from '../../styles/themeUtils';
import SignUpEmojiIcon from '../../assets/icons/SignUpEmoji.svg';
import PageHeader from '../../components/PageHeader';
import SignUpTitle from '../../components/Signup/SignUpTitle';
import TextField from '../../components/Signup/TextField';

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${c('neutral.black2')};
  display: flex;
  flex-direction: column;
  position: relative;
`;

const BlurredBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${c('neutral.black2')};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 1;
  will-change: transform;
  transform: translateZ(0);
`;

const BackgroundContent = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.5;
  filter: blur(8px);
  z-index: 0;
  pointer-events: none;
  will-change: transform;
  transform: translateZ(0);
`;

const StyledHeader = styled.div`
  filter: blur(8px);
  opacity: 0.6;
`;

const StyledTitle = styled.div`
  filter: blur(8px);
  opacity: 0.6;
`;

const StyledFields = styled.div`
  padding: 0 ${s('md')};
  filter: blur(8px);
  opacity: 0.6;
`;

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: ${s('lg')};
`;

const BottomSheet = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${c('neutral.white')};
  border-radius: 24px 24px 0 0;
  padding: ${s('lg')} ${s('md')} ${s('xl')};
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
  z-index: 10;
  will-change: transform;
  
  @keyframes slideUp {
    from {
      transform: translateY(100%) translateZ(0);
    }
    to {
      transform: translateY(0) translateZ(0);
    }
  }
`;

const DragHandle = styled.div`
  width: 40px;
  height: 4px;
  background: ${c('neutral.gray')};
  border-radius: 2px;
  margin: 0 auto ${s('md')};
`;

const Title = styled.h1`
  ${typography('headline01')};
  color: ${c('neutral.black')};
  margin-bottom: ${s('xl')};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: ${s('sm')};
  margin-bottom: ${s('xl')};
`;

const Emoji = styled.div`
  margin-bottom: ${s('sm')};
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;

  img {
    width: 64px;
    height: 64px;
  }
`;

const MainMessage = styled.h2`
  font-family: ${({ theme }) => theme.font.typography.display01.family};
  font-size: ${({ theme }) => theme.font.typography.display01.size};
  font-weight: ${({ theme }) => theme.font.weight.regular};
  color: ${c('neutral.black')};
  text-align: center;
  margin: 0;
`;

const SubMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  margin-top: 0;
`;

const SubText = styled.p`
  font-family: ${({ theme }) => theme.font.typography.body01.family};
  font-size: ${({ theme }) => theme.font.typography.body01.size};
  font-weight: ${({ theme }) => theme.font.typography.body01.weight};
  color: ${c('neutral.black2')};
  text-align: center;
  line-height: 1.5;
`;

const ButtonContainer = styled.div`
  margin-top: auto;
  padding-top: ${s('lg')};
  width: 100%;
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 20px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: ${c('brand.pink')};
  color: ${c('neutral.white')};
  ${typography('label01')};
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${c('brand.darkPink')};
  }

  &:active {
    background: ${c('brand.darkPink')};
  }
`;

export default function SignUpComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const nickname = location.state?.nickname || '숨쉬는 고양이';
  const formData = location.state?.formData || {
    email: '',
    password: '',
    passwordConfirm: '',
  };

  const handleLogin = () => {
    navigate('/login');
  };

  // 배경 콘텐츠를 메모이제이션하여 불필요한 리렌더링 방지
  const backgroundContent = useMemo(
    () => (
      <BackgroundContent>
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
      </BackgroundContent>
    ),
    [nickname, formData]
  );

  return (
    <PageContainer>
      {backgroundContent}
      <BlurredBackground />
      <BottomSheet>
        <DragHandle />
        <Title>회원가입</Title>
        <Content>
          <Emoji>
            <img src={SignUpEmojiIcon} alt="회원가입 완료" />
          </Emoji>
          <MainMessage>회원가입이 완료되었어요!</MainMessage>
          <SubMessage>
            <SubText>서비스에 가입해주셔서 감사합니다</SubText>
            <SubText>즐거운 'PLINK'되세요!</SubText>
          </SubMessage>
        </Content>
        <ButtonContainer>
          <LoginButton onClick={handleLogin}>
            로그인하기
          </LoginButton>
        </ButtonContainer>
      </BottomSheet>
    </PageContainer>
  );
}
