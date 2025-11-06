import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styled from 'styled-components';
import { c, s, typography } from '../../styles/themeUtils';

import PhotoStart from '../../../src/assets/icons/PhotoStart.svg';
import NavButton from '../../components/Signup/NavButton';

export default function Photo() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/photo/booth');
  };
  return (
    <>
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
      </Container>
    </>
  );
}
const Container = styled.div`
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${s('lg')};
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
