import TitleBar from './TitleBar';
import eventIcon from '../../assets/icons/HomeEvent.svg';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { c, f, s } from '../../styles/themeUtils';
import { BoxContainer } from './BoxContainer';
export default function EventBox() {
  const banners = [
    { id: 1, color: 'pink', text: '게임' },
    { id: 2, color: 'white', text: '사진찍기' },
    { id: 3, color: 'gray', text: '다른 거' },
  ];

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  //자동 전환
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setIndex(prev => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // 방향 이동 함수
  const paginate = newDirection => {
    setDirection(newDirection);
    setIndex(prev => (prev + newDirection + banners.length) % banners.length);
  };

  return (
    <BoxContainer>
      <TitleBar
        imageurl={eventIcon}
        title="이벤트"
        description="현장에서만 즐길 수 있는 이벤트에 참여하세요!"
      />
      <BannerWrapper>
        <AnimatePresence initial={false} custom={direction} mode="sync">
          <SlideBanner
            key={banners[index].id}
            color={banners[index].color}
            custom={direction}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = offset.x + velocity.x * 0.5;
              if (swipe < -100)
                paginate(1); // 왼쪽으로 스와이프 → 다음
              else if (swipe > 100) paginate(-1); // 오른쪽으로 스와이프 → 이전
            }}
            initial={{ x: direction > 0 ? 100 : -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -100 : 100, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {banners[index].text}
          </SlideBanner>
        </AnimatePresence>
      </BannerWrapper>

      <Dots>
        {banners.map((_, i) => (
          <Dot
            key={i}
            active={i === index}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
          />
        ))}
      </Dots>
    </BoxContainer>
  );
}
const BannerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
`;
const SlideBanner = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background-color: ${({ color }) => color || c('neutral.white')};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 18px;
`;

const Dots = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 8px;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ active }) => (active ? c('brand.pink') : '#ddd')};
  cursor: pointer;
  transition: background 0.3s ease;
`;
