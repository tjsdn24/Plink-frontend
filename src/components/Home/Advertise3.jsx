import React from 'react';
import styled from 'styled-components';

import Can from '../../assets/icons/HomeCan.svg';
import Mint from '../../assets/icons/HomeMintAd.svg';
import Logo from '../../assets/icons/HomeRedbullLogo.svg';
import White from '../../assets/icons/HomeWhite.svg';

export default function Advertise3() {
  return (
    <WhiteBox>
      <Wrapper>
        <img src={Logo} alt="logo" />

        <img src={Mint} alt="mint" />
      </Wrapper>

      <img src={Can} alt="can" />
      <img src={White} alt="white" />
    </WhiteBox>
  );
}

// 광고영역
const WhiteBox = styled.div`
  width: 100%;
  height: 120px;
  border-radius: 12px;
  background: #0a1a44;
  padding: 14px;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;
