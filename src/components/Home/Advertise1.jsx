import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styled from 'styled-components';
import { c, s, typography } from '../../styles/themeUtils';

import Mystery from '../../assets/icons/GameMystery.svg';
export default function Advertise1() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/photo');
  };
  return (
    <>
      <WhiteBox>
        <Wrapper>
          <TitleText>행운의 7.77초를 잡아라!</TitleText>
          <DescriptText>이벤트 참여하고 시크릿프레임 받자</DescriptText>
          <GoText>게임하러 가기</GoText>
        </Wrapper>

        <MysteryCard src={Mystery} />
      </WhiteBox>
      <BackText>
        <BackText>
          {'7 7 7 '.repeat(100)} {/* ← 7을 100번 반복 */}
        </BackText>
      </BackText>
    </>
  );
}
//광고영역
const WhiteBox = styled.div`
  width: 100%;
  height: 120px;
  border-radius: 12px;
  background: ${c('brand.pink')};
  position: absolute;
  z-index: 0;
  padding: 14px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const TitleText = styled.h1`
  ${typography('display01')};
  color: ${c('neutral.white')};
  z-index: 9;
`;
const DescriptText = styled.span`
  ${typography('body02')};

  color: ${c('neutral.white')};
  z-index: 9;
`;
const GoText = styled.div`
  ${typography('headline01')};
  color: ${c('neutral.white')};
`;
const MysteryCard = styled.img``;
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
