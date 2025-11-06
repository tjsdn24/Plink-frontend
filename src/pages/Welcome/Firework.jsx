import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import BigStar1 from '../../assets/icons/Star/BigStar1.svg';
import BigStar2 from '../../assets/icons/Star/BigStar2.svg';
import BigStar3 from '../../assets/icons/Star/BigStar3.svg';
import BigStar4 from '../../assets/icons/Star/BigStar4.svg';
import MediumStar from '../../assets/icons/Star/MediumStar.svg';
import SmallStar1 from '../../assets/icons/Star/SmallStar1.svg';
import SmallStar2 from '../../assets/icons/Star/SmallStar2.svg';
import SmallStar3 from '../../assets/icons/Star/SmallStar3.svg';
import SmallStar4 from '../../assets/icons/Star/SmallStar4.svg';

const FireworkContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2001;
  overflow: hidden;
`;

const PARTICLE_COUNT = 30; // 파티클 수 (화면에 골고루 배치)

// Star SVG 파일 배열
const STAR_IMAGES = [
  BigStar1,
  BigStar2,
  BigStar3,
  BigStar4,
  MediumStar,
  SmallStar1,
  SmallStar2,
  SmallStar3,
  SmallStar4,
];

// 랜덤 Star SVG 선택
const getRandomStar = () => {
  return STAR_IMAGES[Math.floor(Math.random() * STAR_IMAGES.length)];
};

export default function Firework({ duration = 2000, onComplete }) {
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);
  const styleElementRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 스타일 요소 생성 (한 번만)
    if (!styleElementRef.current) {
      const styleElement = document.createElement('style');
      styleElement.id = 'firework-styles';
      document.head.appendChild(styleElement);
      styleElementRef.current = styleElement;
    }

    // 동적으로 파티클 생성
    const createParticles = () => {
      const uniqueId = Math.random().toString(36).substr(2, 9);
      
      // 파티클 위치 생성 함수 (텍스트 영역 제외, 텍스트 줄 사이 공간 포함)
      const generateParticlePositions = (count) => {
        const positions = [];
        
        // 텍스트 영역 정의
        // 닉네임 영역: 35% ~ 45% top
        // 텍스트 사이 공간: 45% ~ 50% top (파티클 배치 가능)
        // 환영 메시지 영역: 50% ~ 60% top
        const nicknameTop = 35;
        const nicknameBottom = 45;
        const welcomeTop = 50;
        const welcomeBottom = 60;
        const textAreaLeft = 15;
        const textAreaRight = 85;
        
        // 텍스트가 있는 영역인지 확인하는 함수 (텍스트 줄 사이는 제외)
        const isInTextLine = (top, left) => {
          // 텍스트 영역 내에 있고, 텍스트 줄 사이 공간이 아닌 경우
          if (left >= textAreaLeft && left <= textAreaRight) {
            // 닉네임 영역
            if (top >= nicknameTop && top <= nicknameBottom) {
              return true;
            }
            // 환영 메시지 영역
            if (top >= welcomeTop && top <= welcomeBottom) {
              return true;
            }
          }
          return false;
        };
        
        // 화면을 그리드로 나누어 골고루 배치
        const gridCols = Math.ceil(Math.sqrt(count * 1.5));
        const gridRows = Math.ceil(count / gridCols);
        
        // 각 그리드 셀에 파티클 배치 (텍스트 영역 제외)
        let attempts = 0;
        for (let i = 0; i < count && attempts < count * 5; i++) {
          attempts++;
          const row = Math.floor(i / gridCols);
          const col = i % gridCols;
          
          // 그리드 셀 내에서 랜덤 위치
          const cellTop = (row / gridRows) * 90 + 5; // 5% ~ 95%
          const cellLeft = (col / gridCols) * 90 + 5; // 5% ~ 95%
          
          // 셀 내에서 약간의 랜덤 오프셋 추가
          let top = cellTop + (Math.random() - 0.5) * (90 / gridRows);
          let left = cellLeft + (Math.random() - 0.5) * (90 / gridCols);
          
          // 화면 경계 내로 제한
          const clampedTop = Math.max(5, Math.min(95, top));
          const clampedLeft = Math.max(5, Math.min(95, left));
          
          // 텍스트 줄이 아니면 추가 (텍스트 줄 사이 공간은 허용)
          if (!isInTextLine(clampedTop, clampedLeft)) {
            const rotation = Math.random() * 360;
            positions.push({ top: clampedTop, left: clampedLeft, rotation });
          } else {
            i--; // 텍스트 줄이면 다시 시도
          }
        }
        
        // 텍스트 줄 사이 공간(45% ~ 50% top, 15% ~ 85% left)에 파티클 추가
        const textGapCount = Math.floor(count * 0.15); // 전체의 15% 추가
        for (let i = 0; i < textGapCount; i++) {
          const top = Math.random() * 5 + 45; // 45% ~ 50% (텍스트 사이 공간)
          const left = Math.random() * 70 + 15; // 15% ~ 85%
          const rotation = Math.random() * 360;
          positions.push({ top, left, rotation });
        }
        
        // 오른쪽 하단 영역(60% ~ 95% top, 60% ~ 95% left)에 추가 파티클 배치
        const bottomRightCount = Math.floor(count * 0.2);
        for (let i = 0; i < bottomRightCount; i++) {
          const top = Math.random() * 35 + 60; // 60% ~ 95%
          const left = Math.random() * 35 + 60; // 60% ~ 95%
          if (!isInTextLine(top, left)) {
            const rotation = Math.random() * 360;
            positions.push({ top, left, rotation });
          }
        }
        
        // 중앙 아래 영역(50% ~ 80% top, 30% ~ 70% left)에 추가 파티클 배치
        const centerBottomCount = Math.floor(count * 0.2);
        for (let i = 0; i < centerBottomCount; i++) {
          let top = Math.random() * 30 + 50; // 50% ~ 80%
          let left = Math.random() * 40 + 30; // 30% ~ 70%
          
          // 텍스트 줄이면 위치 조정
          if (isInTextLine(top, left)) {
            // 텍스트 아래로 이동
            top = Math.max(welcomeBottom + 5, top);
          }
          
          const rotation = Math.random() * 360;
          positions.push({ top, left, rotation });
        }
        
        // 하단 전체 영역(70% ~ 95% top, 5% ~ 95% left)에 추가 파티클 배치
        const bottomCount = Math.floor(count * 0.25);
        for (let i = 0; i < bottomCount; i++) {
          const top = Math.random() * 25 + 70; // 70% ~ 95%
          const left = Math.random() * 90 + 5; // 5% ~ 95%
          if (!isInTextLine(top, left)) {
            const rotation = Math.random() * 360;
            positions.push({ top, left, rotation });
          }
        }
        
        return positions;
      };
      
      const particlePositions = generateParticlePositions(PARTICLE_COUNT);
      
      // 파티클들 생성 (각 파티클이 개별적으로 Fade In, Scale Up, Rotate)
      particlePositions.forEach((pos, index) => {
        const particleId = `${uniqueId}-${index}`;
        const starImage = getRandomStar();
        
        // 각 파티클마다 고유한 keyframes 생성 (Fade In, Scale Up, Rotate)
        const particleKeyframes = `
          @keyframes firework-${particleId} {
            0% { 
              transform: translate(-50%, -50%) scale(0) rotate(0deg);
              opacity: 0;
            }
            50% { 
              transform: translate(-50%, -50%) scale(1.2) rotate(${pos.rotation}deg);
              opacity: 1;
            }
            100% { 
              transform: translate(-50%, -50%) scale(1) rotate(${pos.rotation + 180}deg);
              opacity: 0.8;
            }
          }
        `;
        styleElementRef.current.textContent += particleKeyframes;
        
        // 순차적으로 나타나도록 delay 계산 (펑펑 터지는 느낌)
        const delay = index * 0.02; // 각 파티클마다 0.02초씩 지연
        
        const particle = document.createElement('div');
        particle.innerHTML = `<img src="${starImage}" alt="star" />`;
        particle.style.cssText = `
          position: absolute;
          top: ${pos.top}%;
          left: ${pos.left}%;
          display: block;
          pointer-events: none;
          transform: translate(-50%, -50%);
          animation: firework-${particleId} 1.5s ease-out forwards;
          animation-delay: ${delay}s;
          opacity: 0;
        `;
        container.appendChild(particle);
      });
    };

    // 폭죽 파티클 생성 (한 번에 모든 파티클 생성)
    createParticles();

    // duration 후 정리
    timeoutRef.current = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, duration);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // 파티클 제거
      if (container) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }
      // 스타일 태그 제거
      if (styleElementRef.current) {
        styleElementRef.current.remove();
        styleElementRef.current = null;
      }
    };
  }, [duration, onComplete]);

  return (
    <FireworkContainer>
      <div ref={containerRef} className="pyro" />
    </FireworkContainer>
  );
}
