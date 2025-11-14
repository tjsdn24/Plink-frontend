import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { c, f, s } from '../../styles/themeUtils';
import axios from 'axios';

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
  const [popularPoll, setPopularPoll] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [usernum, setUsernum] = useState(0);

  //닉네임 갱신
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
  //인기글 api
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  async function fetchData() {
    try {
      const response = await axios.get(`${BASE_URL}/line4thon/main/popular`);
      setPopularPosts(response.data.popularPosts);
      setPopularPoll(response.data.popularPoll);
    } catch (error) {
      console.error('데이터 불러오기 실패:', error);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  async function getActiveUsers(slug) {
    try {
      const res = await axios.get(`${BASE_URL}/plink/festivals/${slug}/active-users`);
      return res.data;
    } catch (err) {
      console.error('active-users 불러오기 실패:', err);
      return null;
    }
  }
  useEffect(() => {
    async function load() {
      const users = await getActiveUsers('line4thon');
      if (users !== null) setUsernum(users.line4thon);
    }

    load();

    const interval = setInterval(load, 10000); // 10초마다 자동 갱신

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <HomeContainer>
        <InfoBar nickname={nickname} usernum={usernum} />
        <ChatBox />
        <VoteBox popularPoll={popularPoll} />
        <EventBox />
        <HotBox popularPosts={popularPosts} />
        <CircleImg src={Pink} top="-20px" right="-577px" />
        <CircleImg src={Purple} top="666px" left="-499px" />
        <CircleImg src={Purple} top="800px" right="-577px" />
        <CircleImg src={Pink} top="1000px" left="-499px" />
      </HomeContainer>
    </>
  );
}
