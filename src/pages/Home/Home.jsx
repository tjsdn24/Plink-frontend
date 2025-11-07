import styled from 'styled-components';
import { c, f, s } from '../../styles/themeUtils';

import InfoBar from '../../components/Home/InfoBar';
import ChatBox from '../../components/Home/ChatBox';
import VoteBox from '../../components/Home/VoteBox';
import EventBox from '../../components/Home/EventBox';
import HotBox from '../../components/Home/HotBox';
import Pink from '../../assets/icons/HomePinkCircle.svg';
import Purple from '../../assets/icons/HomePurpleCircle.svg';

const HomeContainer = styled.div`
  padding: ${s('md')};
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
  min-height: 100vh;
  overflow: hidden;
`;
const CircleImg = styled.img`
  position: absolute;
  z-index: -1;
  top: ${({ top }) => top + '60px' || 'auto'};
  left: ${({ left }) => left || 'auto'};
  right: ${({ right }) => right || 'auto'};
  bottom: ${({ bottom }) => bottom - '60px' || 'auto'};
`;
export default function Home() {
  return (
    <>
      <HomeContainer>
        <InfoBar />
        <ChatBox />
        <VoteBox />
        <EventBox />
        <HotBox />
        <CircleImg src={Pink} top="323px" right="-177px" />
        <CircleImg src={Purple} top="866px" left="-118px" />
        <CircleImg src={Purple} bottom="223px" right="-139px" />
        <CircleImg src={Pink} bottom="-107px" left="-276px" />
      </HomeContainer>
    </>
  );
}
