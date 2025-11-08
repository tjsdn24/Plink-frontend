import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styled from 'styled-components';
import { c, s, typography } from '../../styles/themeUtils';

import PhotoStart from '../../../src/assets/icons/PhotoStart.svg';
import NavButton from '../../components/Signup/NavButton';
import Pink from '../../assets/icons/LoginPink.svg';
import Purple from '../../assets/icons/LoginPurple.svg';

export default function Photo() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/photo/booth');
  };
  return (
    <PageContainer>
      <Container>
        <Icon src={PhotoStart} alt="포토부스 시작 아이콘" />
        <Wrapper>
          <Title>
            PLINK 네컷 프레임으로 <br />
            특별한 순간을 남겨보세요!
          </Title>
          <Description>
            촬영하기를 누르면 총 4장의 사진을 <br />
            연속으로 촬영하게 됩니다.
          </Description>
        </Wrapper>
        <NavButton isActive onClick={handleClick}>
          촬영하기
        </NavButton>
        <CircleImg src={Purple} bottom="-340px" right="10px" />
        <CircleImg src={Pink} bottom="-320px" left="130px" />
      </Container>
    </PageContainer>
  );
}
const PageContainer = styled.div`
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden; /* 스크롤 차단 */
  z-index: 0;
`;
const Container = styled.div`
  padding-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${s('lg')};
  height: 100%;
`;
const Icon = styled.img`
  height: 80px;
`;
const Wrapper = styled.div`
  gap: ${s('md')};
  display: flex;
  flex-direction: column;
`;
const Title = styled.h1`
  ${typography('display01')};
  text-align: center;
`;
const Description = styled.p`
  ${typography('body02')};
  text-align: center;
`;

const CircleImg = styled.img`
  position: absolute;
  z-index: -1;
  top: ${({ top }) => top || 'auto'};
  left: ${({ left }) => left || 'auto'};
  right: ${({ right }) => right || 'auto'};
  bottom: ${({ bottom }) => bottom || 'auto'};
`;
