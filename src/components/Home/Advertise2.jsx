import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styled from 'styled-components';
import { c, s, typography } from '../../styles/themeUtils';

import Camera from '../../assets/icons/PhotoStart.svg';
import Purple from '../../assets/icons/HomePurpleEllipse.svg';
import Pink from '../../assets/icons/HomePinkEllipse.svg';

export default function Advertise2() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/game/play');
  };

  return (
    <>
      <WhiteBox>
        <Ellipse src={Purple} top="0px" right="0px" />
        <Ellipse src={Pink} top="0px" left="0px" />

        <Wrapper>
          <TitleText>
            추억의 순간을 남기는
            <br />
            가장 현명한 방법
          </TitleText>
          <DescriptText>PLINK 네컷 찍기</DescriptText>
        </Wrapper>

        <MysteryCard src={Camera} />
      </WhiteBox>
    </>
  );
}
//광고영역
const WhiteBox = styled.div`
  position: absolute;
  width: 100%;
  height: 120px;
  border-radius: 16px;
  background: #fff;
  z-index: 0;
  padding: 14px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 14px;
`;
const Wrapper = styled.div``;
const TitleText = styled.h1`
  color: ${c('neutral.black')};

  ${typography('display01')};
  z-index: 9;
`;
const DescriptText = styled.span`
  color: ${c('neutral.black')};
  z-index: 9;
`;

const MysteryCard = styled.img`
  width: 113.335px;
  height: 71.204px;
`;

const Ellipse = styled.img`
  position: absolute;
  z-index: 99999px;
  border-radius: 12px;
  top: ${({ top }) => top || 'auto'};
  left: ${({ left }) => left || 'auto'};
  right: ${({ right }) => right || 'auto'};
  bottom: ${({ bottom }) => bottom || 'auto'};
`;
