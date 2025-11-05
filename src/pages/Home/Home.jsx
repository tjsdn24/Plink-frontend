import styled from 'styled-components';
import { c, f, s } from '../../styles/themeUtils';

import InfoBar from '../../components/Home/InfoBar';
import ChatBox from '../../components/Home/ChatBox';
import VoteBox from '../../components/Home/VoteBox';
import EventBox from '../../components/Home/EventBox';
import HotBox from '../../components/Home/HotBox';

const HomeContainer = styled.div`
  padding: ${s('md')};
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export default function Home() {
  return (
    <HomeContainer>
      <InfoBar />
      <ChatBox />
      <VoteBox />
      <EventBox />
      <HotBox />
    </HomeContainer>
  );
}
