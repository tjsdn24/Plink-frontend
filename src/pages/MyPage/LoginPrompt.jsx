import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { c, s, typography } from '../../styles/themeUtils';
import LockIconSvg from '../../assets/icons/Mylock.svg';

const BlurOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: -290px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(0, 0, 0, 0.4) 40%,
    rgba(0, 0, 0, 0.6) 50%,
    rgba(0, 0, 0, 0.8) 55%,
    rgba(0, 0, 0, 1) 100%
  );
  pointer-events: none;
  z-index: 10;
`;

const LoginPromptContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  transform: translateY(70px);
  background: transparent;
  padding: ${s('lg')};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: ${s('md')};
  width: 100%;
  min-height: 305px;
  box-sizing: border-box;
  pointer-events: auto;
`;

const LoginPromptHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${s('sm')};
`;

const LockIconWrapper = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const LockIconImage = styled.img`
  width: 24px;
  height: 24px;
`;

const LoginPromptTitle = styled.div`
  ${typography('headline02')};
  color: ${c('neutral.white')};
  font-weight: 700;
`;

const LoginPromptDescription = styled.div`
  ${typography('body02')};
  color: ${c('neutral.bg')};
`;

const LoginButton = styled.button`
  width: 100%;
  padding: ${s('md')};
  background: ${c('brand.pink')};
  border-radius: ${({ theme }) => theme.radius.md};
  ${typography('label01')};
  color: ${c('neutral.white')};
  text-align: center;
  cursor: pointer;

  pointer-events: auto;
  
  &:hover {
    background: ${c('brand.darkPink')};
  }
`;

export default function LoginPrompt() {
  const navigate = useNavigate();
  
  const handleLoginClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/login');
  };

  return (
    <>
      <BlurOverlay />
      <LoginPromptContainer>
        <LoginPromptHeader>
          <LockIconWrapper>
            <LockIconImage src={LockIconSvg} alt="자물쇠" />
          </LockIconWrapper>
          <LoginPromptTitle>더 많은 기능을 사용하려면?</LoginPromptTitle>
        </LoginPromptHeader>
        <LoginPromptDescription>
          로그인 후 축제를 더욱 즐겁게 즐기세요!
        </LoginPromptDescription>
        <LoginButton onClick={handleLoginClick}>로그인하기</LoginButton>
      </LoginPromptContainer>
    </>
  );
}

