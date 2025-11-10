import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styled from 'styled-components';
import { c, s, typography } from '../../styles/themeUtils';
import rank from '../../assets/icons/HomeTalk.svg';
import Alert from '../../components/Game/Alert';
import alert from '../../assets/icons/GameAlert.svg';
import lightbulb from '../../assets/icons/GameLightBulb.svg';
import triangle from '../../assets/icons/GameTriangleAlert.svg';

import Mystery from '../../assets/icons/GameMystery.svg';
export default function Game() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/game/play');
  };
  return (
    <>
      <Container>
        <Alert icon={alert} alerttext="방금 멋쟁이 사자가 성공했어요! " />
        <WhiteBox>
          <BackText>
            <BackText>
              {'7 7 7 '.repeat(100)} {/* ← 7을 100번 반복 */}
            </BackText>
          </BackText>

          <TitleText>행운의 7.77초를 잡아라!</TitleText>
          <DescriptText>
            이벤트 참여하고 7.77초를 인증하면 <br />
            4호선톤에서만 사용할 수 있는 <br />
            오늘의 특별한 프레임이?!
          </DescriptText>
          <MysteryCard src={Mystery} />
        </WhiteBox>
        <StartButton isActive onClick={handleClick}>
          지금 도전하기
        </StartButton>
        <Alert
          icon={triangle}
          title="이벤트 참여 방법 "
          text="1. 버튼을 누르고 7.77초에 정확히 손을 떼세요!"
          text2="2. 성공 즉시 [시크릿 프레임]이 지급됩니다."
          text3="3. [시크릿 프레임]을 이용해 사진 찍고 즐긴다!"
        />
        <Alert
          icon={lightbulb}
          title="참여시 유의사항 "
          text="1. 미션 성공 시 시크릿프레임이 지급됩니다."
          text2="2. 기회는 무제한으로 제공됩니다."
        />
      </Container>
    </>
  );
}
//광고영역
const WhiteBox = styled.div`
  width: 100%;
  height: 210px;
  border-radius: 16px;
  background: ${c('brand.pink')};
  position: relative;
  z-index: 0;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const TitleText = styled.h1`
  ${typography('display01')};
  color: ${c('neutral.white')};
  z-index: 9;
`;
const DescriptText = styled.span`
  color: ${c('neutral.white')};
  z-index: 9;
`;

const MysteryCard = styled.img`
  position: absolute;
  top: 30px;
  right: 10px;
  z-index: -9;
`;
const BackText = styled.div`
  position: absolute;
  width: 100%;
  height: 210px;
  top: auto;
  ${typography('display02')};
  color: ${c('neutral.white')};
  opacity: 0.4;
  overflow: hidden;
`;

const Container = styled.div`
  padding-top: 60px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: flex-start;
  gap: ${s('lg')};
`;

const StartButton = styled.button`
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
