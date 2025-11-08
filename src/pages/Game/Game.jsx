import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styled from 'styled-components';
import { c, s, typography } from '../../styles/themeUtils';
import rank from '../../assets/icons/HomeTalk.svg';
import Alert from '../../components/Game/Alert';
import TitleBar from '../../components/Home/TitleBar';

export default function Game() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/game/play');
  };
  return (
    <>
      <Container>
        <WhiteBox></WhiteBox>
        <StartButton isActive onClick={handleClick}>
          게임 시작하기
        </StartButton>
        <Alert description="멋쟁이사자처럼이 " />
        <TitleBar
          imageurl={rank}
          title="이구역 랭킹왕"
          description="지금 바로 게임에 참여해 랭킹에 등록하세요!"
          onClick={() => navigate('/game/rank')}
          showArrow={true}
        />
      </Container>
    </>
  );
}

const Container = styled.div`
  padding-top: 60px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: flex-start;
  gap: ${s('lg')};
`;
const WhiteBox = styled.div`
  width: 100%;
  height: 180px;
  border-radius: 16px;
  background-color: #fff;
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
