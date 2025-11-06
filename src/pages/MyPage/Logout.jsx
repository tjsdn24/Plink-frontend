import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { c, s, typography } from '../../styles/themeUtils';
import LogoutEmojiIcon from '../../assets/icons/LogoutEmoji.svg';
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

const EmojiIcon = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${c('sub.lightBlue')};
  border-radius: 50%;
  margin-bottom: ${s('sm')};

  img {
    width: 64px;
    height: 64px;
  }
`;

const MainMessage = styled.h2`
  ${typography('display02')};
  color: ${c('neutral.black')};
  text-align: center;
  margin: 0;
`;

const HelperText = styled.div`
  ${typography('body01')};
  color: ${c('neutral.black2')};
  text-align: center;
  line-height: 1.5;
  margin-top: 0;
`;

const ButtonContainer = styled.div`
  margin-top: auto;
  padding-top: ${s('lg')};
  width: 100%;
`;

const LogoutButton = styled.button`
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

export default function Logout() {
  const navigate = useNavigate();
  
  // localStorage에서 현재 닉네임 가져오기
  const getStoredNickname = () => {
    return localStorage.getItem('userNickname') || '숨쉬는 고양이';
  };
  
  const initialNickname = getStoredNickname();

  const handleLogout = () => {
    // localStorage에서 로그인 상태 제거
    localStorage.removeItem('isLoggedIn');
    
    // 로그아웃 이벤트 발생
    window.dispatchEvent(new Event('storage'));
    
    // 마이페이지로 이동
    navigate('/mypage');
  };

  // 배경 콘텐츠를 메모이제이션하여 불필요한 리렌더링 방지
  const backgroundContent = useMemo(
    () => (
      <BackgroundContent>
        <StyledHeader>
          <PageHeader title="마이페이지" />
        </StyledHeader>
        <StyledTitle>
          <SignUpTitle userName={initialNickname} />
        </StyledTitle>
        <StyledFields>
          <FieldsContainer>
            <TextField
              name="email"
              placeholder="이메일 입력"
              helperText="이메일을 입력해주세요."
              value=""
              onChange={() => {}}
              disabled
            />
          </FieldsContainer>
        </StyledFields>
      </BackgroundContent>
    ),
    [initialNickname]
  );

  return (
    <PageContainer>
      {backgroundContent}
      <BlurredBackground />
      <BottomSheet>
        <DragHandle />
        <Title>로그아웃</Title>
        <Content>
          <EmojiIcon>
            <img src={LogoutEmojiIcon} alt="로그아웃" />
          </EmojiIcon>
          <MainMessage>정말 로그아웃 하시겠어요?</MainMessage>
          <HelperText>
            로그아웃 후 PLINK를<br />
            사용하기 위해서는 재로그인이 필요합니다.
          </HelperText>
        </Content>
        <ButtonContainer>
          <LogoutButton onClick={handleLogout}>
            로그아웃하기
          </LogoutButton>
        </ButtonContainer>
      </BottomSheet>
    </PageContainer>
  );
}
