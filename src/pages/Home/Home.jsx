import { useEffect, useState } from 'react';
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
  top: ${({ top }) => top || 'auto'};
  left: ${({ left }) => left || 'auto'};
  right: ${({ right }) => right || 'auto'};
  bottom: ${({ bottom }) => bottom || 'auto'};
`;
export default function Home() {
  const [nickname, setNickname] = useState(
    () => localStorage.getItem('nickname') || '숨쉬는 고양이'
  );

  useEffect(() => {
    const handleProfileUpdate = () => {
      const storedNickname = localStorage.getItem('nickname');
      if (storedNickname) {
        setNickname(storedNickname);
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  return (
    <>
      <HomeContainer>
        <InfoBar nickname={nickname} />
        <ChatBox />
        <VoteBox />
        <EventBox />
        <HotBox />
        <CircleImg src={Pink} top="-20px" right="-577px" />
        <CircleImg src={Purple} top="666px" left="-499px" />
        <CircleImg src={Purple} top="800px" right="-577px" />
        <CircleImg src={Pink} top="1000px" left="-499px" />
      </HomeContainer>
    </>
  );
}
