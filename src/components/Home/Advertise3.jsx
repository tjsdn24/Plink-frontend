import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styled from 'styled-components';
import { c, s, typography } from '../../styles/themeUtils';

import Can from '../../assets/icons/HomeCan.svg';
import Mint from '../../assets/icons/HomeMintAd.svg';
import Logo from '../../assets/icons/HomeRedbullLogo.svg';
import White from '../../assets/icons/HomeWhite.svg';

export default function Advertise3() {
  return (
    <>
      <WhiteBox>
        <Wrapper>
          <img src={Can} />
          <img src={Mint} />
        </Wrapper>

        <img src={Logo} />
        <img src={White} />
      </WhiteBox>
    </>
  );
}
//광고영역
const WhiteBox = styled.div`
  width: 100%;
  height: 120px;
  border-radius: 12px;
  background: #0a1a44;
  z-index: 0;
  padding: 14px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 14px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
