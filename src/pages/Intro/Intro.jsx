import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import IntroPink from '../../assets/icons/IntroPink.svg';
import IntroPurple from '../../assets/icons/IntroPurple.svg';
import IntroArrow from '../../assets/icons/IntroArrow.svg';
import { typography } from '../../styles/themeUtils';

const pinkDrift = keyframes`
  0% {
    transform: translate(-50%, -50%) translateY(-40px) scale(1);
  }
  33% {
    transform: translate(-50%, -50%) translateY(20px) scale(1.08);
  }
  66% {
    transform: translate(-50%, -50%) translateY(40px) scale(1.1);
  }
  100% {
    transform: translate(-50%, -50%) translateY(-40px) scale(1);
  }
`;

const purpleDrift = keyframes`
  0% {
    transform: translate(-50%, -50%) translateX(-30px) rotate(0deg);
  }
  25% {
    transform: translate(-50%, -50%) translateX(10px) rotate(10deg);
  }
  50% {
    transform: translate(-50%, -50%) translateX(30px) rotate(20deg);
  }
  75% {
    transform: translate(-50%, -50%) translateX(-5px) rotate(8deg);
  }
  100% {
    transform: translate(-50%, -50%) translateX(-30px) rotate(0deg);
  }
`;

export default function Intro() {
  const navigate = useNavigate();

  return (
    <Screen>
      <Aurora>
        <PinkBlob />
        <PurpleBlob />
      </Aurora>

      <Content>
        <Title>신나게 다른 사람들과 <br /> 즐길 준비가 되셨나요?</Title>
        <SwipeHint onClick={() => navigate('/login')}>
          <Arrow src={IntroArrow} alt="밀어서 시작하기" />
          <SwipeLine />
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
  background: linear-gradient(180deg, #0c0520 0%, #26175a 40%, #a63f7b 100%);
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
`;

const BlobBase = styled.div`
  position: absolute;
  width: 520px;
  height: 520px;
  transform: translate(-50%, -50%);
  will-change: transform;
`;

const PinkBlob = styled(BlobBase)`
  top: 36%;
  left: 48%;
  background: url(${IntroPink}) no-repeat center / contain;
  animation: ${pinkDrift} 15s ease-in-out infinite;
`;

const PurpleBlob = styled(BlobBase)`
  top: 63%;
  left: 60%;
  background: url(${IntroPurple}) no-repeat center / contain;
  animation: ${purpleDrift} 21s ease-in-out infinite;
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
  font-size: 26px;
  line-height: 1.35;
  letter-spacing: 0.6px;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
`;

const SwipeHint = styled.div`
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  opacity: 0.85;
  cursor: pointer;
`;

const Arrow = styled.img`
  height: 18px;
  animation: ${keyframes`
    0%, 100% { transform: translateY(0); opacity: 0.8; }
    50% { transform: translateY(8px); opacity: 1; }
  `} 2.4s ease-in-out infinite;
`;

const SwipeLine = styled.div`
  position: relative;
  width: 220px;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba(86, 156, 255, 0) 0%,
    rgba(86, 156, 255, 0.7) 50%,
    rgba(86, 156, 255, 0) 100%
  );
  border-radius: 999px;
  opacity: 0.8;
`;

const HintLabel = styled.span`
  font-size: 13px;
  letter-spacing: 1px;
`;

