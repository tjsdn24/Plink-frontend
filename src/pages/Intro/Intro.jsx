import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import IntroArrow from '../../assets/icons/IntroArrow.svg';
import IntroPink from '../../assets/icons/IntroPink.svg';
import IntroPurple from '../../assets/icons/IntroPurple.svg';
import { typography } from '../../styles/themeUtils';

const pinkMotion = keyframes`
  0% {
    transform: translate(-50%, -50%) translate(-20px, 60px) scale(0.88);
    opacity: 0.55;
  }
  35% {
    transform: translate(-50%, -50%) translate(18px, -50px) scale(1.04);
    opacity: 0.9;
  }
  65% {
    transform: translate(-50%, -50%) translate(-24px, 20px) scale(1.12);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) translate(22px, -40px) scale(0.9);
    opacity: 0.6;
  }
`;

const purpleMotion = keyframes`
  0% {
    transform: translate(-50%, -50%) translate(-70px, -30px) rotate(-8deg) scale(0.9);
    opacity: 0.5;
  }
  28% {
    transform: translate(-50%, -50%) translate(35px, 50px) rotate(12deg) scale(1.05);
    opacity: 0.85;
  }
  58% {
    transform: translate(-50%, -50%) translate(-20px, 40px) rotate(18deg) scale(1.12);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) translate(55px, -60px) rotate(4deg) scale(0.95);
    opacity: 0.65;
  }
`;

export default function Intro() {
  const navigate = useNavigate();
  const touchStartY = useRef(null);

  const triggerNavigate = () => {
    navigate('/login');
  };

  const handleTouchStart = e => {
    touchStartY.current = e.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = e => {
    if (touchStartY.current === null) return;

    const endY = e.changedTouches[0]?.clientY ?? touchStartY.current;
    const delta = touchStartY.current - endY;

    if (delta > 50) {
      triggerNavigate();
    }

    touchStartY.current = null;
  };

  const handleWheel = e => {
    if (e.deltaY > 30) {
      triggerNavigate();
    }
  };

  return (
    <Screen onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onWheel={handleWheel}>
      <Aurora>
        <PinkAura />
        <PurpleAura />
      </Aurora>
      <Content>
        <Title>신나게 다른 사람들과 <br /> 즐길 준비가 되셨나요?</Title>
        <SwipeHint onClick={() => navigate('/login')}>
          <Arrow src={IntroArrow} alt="밀어서 시작하기" />
          <HintLabel>밀어서 시작하기</HintLabel>
        </SwipeHint>
      </Content>
    </Screen>
  );
}

const Screen = styled.div`
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: #1A1A1E;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  text-align: center;
`;

const Aurora = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`;

const AuraBase = styled.div`
  position: absolute;
  width: 560px;
  height: 560px;
  border-radius: 50%;
  filter: blur(180px);
  opacity: 0.85;
`;

const PinkAura = styled(AuraBase)`
  top: 82%;
  left: 25%;
  background: radial-gradient(circle at center, rgba(249, 64, 158, 0.7) 0%, rgba(249, 64, 158, 0.2) 100%);
  animation: ${pinkMotion} 18s ease-in-out infinite;
`;

const PurpleAura = styled(AuraBase)`
  top: 30%;
  left: 70%;
  background: radial-gradient(circle at center, rgba(156, 136, 255, 0.7) 0%, rgba(156, 136, 255, 0.2) 100%);
  animation: ${purpleMotion} 24s ease-in-out infinite;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 48px;
  padding: 0 32px;
`;

const Title = styled.h1`
  margin: 0;
  ${typography('display01')};
  font-size: 24px;
  line-height: 1.45;
  letter-spacing: 0.8px;
  text-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
  animation: ${keyframes`
    0%, 100% { transform: translateY(0); opacity: 0.92; }
    45% { transform: translateY(-6px); opacity: 1; }
    55% { transform: translateY(-6px); opacity: 1; }
  `} 3.2s ease-in-out infinite;
`;

const SwipeHint = styled.div`
  position: absolute;
  ${typography('body01')};
  bottom: 56px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  opacity: 0.65;
  cursor: pointer;
`;

const Arrow = styled.img`
  height: 20px;
  animation: ${keyframes`
    0%, 100% { transform: translateY(4px); opacity: 0.65; }
    50% { transform: translateY(-8px); opacity: 1; }
  `} 2.3s ease-in-out infinite;
`;

const HintLabel = styled.span`
  font-size: 12px;
  letter-spacing: 2px;
  opacity: 0.85;
`;

