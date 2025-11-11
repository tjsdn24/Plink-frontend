import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { typography } from '../../styles/themeUtils';

// Confetti 애니메이션
const fall = keyframes`
  0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
`;

// Confetti 조각
const ConfettiPiece = styled.div`
  position: absolute;
  width: 8px;
  height: 14px;
  background-color: ${({ color }) => color};
  top: -10vh;
  left: ${({ x }) => x}%;
  animation: ${fall} ${({ duration }) => duration}s linear ${({ delay }) => delay}s infinite;
  opacity: 0.8;
  border-radius: 2px;
`;

// 배경 파티클
const Particle = styled.div`
  position: absolute;
  border-radius: 50%;
  background: ${({ color }) => color};
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  top: ${({ top }) => top}%;
  left: ${({ left }) => left}%;
  opacity: 0.3;
  animation: float 6s ease-in-out infinite;
  @keyframes float {
    0% {
      transform: translateY(0);
      opacity: 0.3;
    }
    50% {
      transform: translateY(-15px);
      opacity: 0.6;
    }
    100% {
      transform: translateY(0);
      opacity: 0.3;
    }
  }
`;

// 전체 컨테이너
const Container = styled.div`
  position: relative;

  width: 100%;
  height: 100vh;
  background: linear-gradient(to bottom right, #fff, #ffeaf5, #f9e6ff);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// 상단 바
const TopBar = styled.div`
  position: absolute;
  top: 32px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  color: #888;
  font-size: 14px;
`;

// 타이틀
const Title = styled.h1`
  ${typography('display01')};
  margin-top: 100px;
  font-size: 22px;
  text-align: center;
`;

// 서브 텍스트
const Sub = styled.p`
  ${typography('body01')};

  margin-top: 8px;
`;

// 목표 시간 표시
const TargetNumber = styled.div`
  font-size: 80px;
  font-weight: 800;
  color: ${({ faded }) => (faded ? '#e0e0e0' : '#F9409E')};
  opacity: ${({ opacity }) => opacity || 1};
  transition: opacity 0.2s;
  margin-top: 100px;
`;

// Hold 버튼
const HoldButton = styled.button`
  margin-top: auto;
  margin-bottom: 120px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: none;
  font-weight: 800;
  font-size: 20px;
  color: ${({ holding }) => (holding ? '#fff' : '#888')};
  background: ${({ holding }) =>
    holding ? 'linear-gradient(135deg, #F9409E, #E0357D)' : '#f5f5f5'};
  box-shadow: ${({ holding }) =>
    holding ? '0 0 30px rgba(249, 64, 158, 0.6)' : '0 2px 8px rgba(0,0,0,0.1)'};
  cursor: pointer;
  transition: all 0.3s;
`;

// 결과 모달
const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ open }) => (open ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
`;
const ModalBox = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 300px;
  text-align: center;
`;
const ModalTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 12px;
`;
const ModalDesc = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
`;
const ModalButton = styled.button`
  background: #f9409e;
  color: white;
  border: none;
  border-radius: 8px;
  width: 100%;
  height: 44px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #e0357d;
  }
`;

export default function GamePlay() {
  const [isHolding, setIsHolding] = useState(false);
  const [time, setTime] = useState(0);
  const [result, setResult] = useState(null);
  const [best, setBest] = useState(7.75);
  const [showModal, setShowModal] = useState(false);
  const [isJackpot, setIsJackpot] = useState(false);
  const startRef = useRef(null);
  const rafRef = useRef(null);
  const TARGET = 7.77;

  // 타이머
  useEffect(() => {
    if (isHolding) {
      startRef.current = Date.now();
      const loop = () => {
        const elapsed = (Date.now() - startRef.current) / 1000;
        setTime(elapsed);
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    } else {
      cancelAnimationFrame(rafRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [isHolding]);

  const handleHoldStart = () => {
    setResult(null);
    setShowModal(false);
    setIsJackpot(false);
    setIsHolding(true);
  };

  const handleHoldEnd = () => {
    if (!isHolding) return;
    setIsHolding(false);
    const finalTime = parseFloat(time.toFixed(2));
    setResult(finalTime);
    const diff = Math.abs(finalTime - TARGET);
    const jackpot = diff === 0;
    setIsJackpot(jackpot);
    if (diff < Math.abs(best - TARGET)) setBest(finalTime);
    setTimeout(() => setShowModal(true), 500);
  };

  // Confetti 색상 랜덤
  const colors = ['#F9409E', '#FF6B9D', '#FFD93D', '#4D96FF', '#6BCB77'];

  return (
    <Container>
      {/* 파티클 배경 */}
      {Array.from({ length: 10 }).map((_, i) => (
        <Particle
          key={i}
          color={colors[i % colors.length]}
          size={8 + Math.random() * 12}
          top={Math.random() * 100}
          left={Math.random() * 100}
        />
      ))}

      {/* Confetti */}
      {isJackpot &&
        Array.from({ length: 50 }).map((_, i) => (
          <ConfettiPiece
            key={i}
            color={colors[Math.floor(Math.random() * colors.length)]}
            x={Math.random() * 100}
            duration={2 + Math.random() * 2}
            delay={Math.random() * 0.5}
          />
        ))}

      <TopBar>
        <div>BEST: {best.toFixed(2)}s</div>
      </TopBar>

      <Title>7.77초 잭팟에 도전하세요!</Title>
      <Sub>버튼을 누르고, 정확히 7.77초에 손을 떼세요!</Sub>
      <Sub>성공 시 [시크릿 프레임] 즉시 획득!</Sub>

      <TargetNumber>{result ?? time.toFixed(2)}</TargetNumber>

      <HoldButton
        holding={isHolding}
        onMouseDown={handleHoldStart}
        onMouseUp={handleHoldEnd}
        onMouseLeave={handleHoldEnd}
        onTouchStart={handleHoldStart}
        onTouchEnd={handleHoldEnd}
      >
        {isHolding ? 'TIMING...' : 'HOLD'}
      </HoldButton>

      <Modal open={showModal}>
        <ModalBox>
          <ModalTitle>
            {isJackpot
              ? '헉! 성공했어요...!!'
              : `아! ${Math.abs(TARGET - (result || 0)).toFixed(2)}초 차이!`}
          </ModalTitle>
          <ModalDesc>
            {isJackpot
              ? '7.77초 달성을 축하해요! 보상을 드릴게요'
              : `${(result || 0).toFixed(2)}초를 기록했습니다.`}
          </ModalDesc>
          <ModalButton onClick={() => setShowModal(false)}>다시 도전하기</ModalButton>
        </ModalBox>
      </Modal>
    </Container>
  );
}
