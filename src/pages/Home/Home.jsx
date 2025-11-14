import { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { s } from '../../styles/themeUtils';
import axios from 'axios';
import { connectSocket, disconnectSocket, subscribeUserCount, sendJoinMessage } from '../../api/Chat/socketApi';

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
  const subscriptionRef = useRef(null);
  const slug = 'line4thon';

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

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/line4thon/main/popular`);
      setPopularPosts(response.data.popularPosts);
      setPopularPoll(response.data.popularPoll);
    } catch (error) {
      console.error('데이터 불러오기 실패:', error);
    }
  }, [BASE_URL]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 초기 사용자 수 가져오기 (폴링 백업)
  const getActiveUsers = useCallback(
    async slug => {
      try {
        const res = await axios.get(`${BASE_URL}/plink/festivals/${slug}/active-users`);
        return res.data;
      } catch (err) {
        console.error('active-users 불러오기 실패:', err);
        return null;
      }
    },
    [BASE_URL]
  );

  // 웹소켓 연결 및 사용자 수 구독
  useEffect(() => {
    let fallbackInterval = null;

    // 초기 사용자 수 로드
    const loadInitialCount = async () => {
      const users = await getActiveUsers(slug);
      console.log('초기 사용자 수 API 응답:', users);
      if (users !== null) {
        // API 응답 형식에 따라 처리
        if (users[slug] !== undefined) {
          setUsernum(users[slug]);
        } else if (users.activeUsers !== undefined) {
          setUsernum(users.activeUsers);
        } else if (typeof users === 'number') {
          setUsernum(users);
        }
      }
    };

    loadInitialCount();

    // 웹소켓 연결
    const onConnected = () => {
      console.log('웹소켓 연결 성공');
      
      // 사용자 수 구독
      subscriptionRef.current = subscribeUserCount(slug, data => {
        console.log('사용자 수 업데이트 받음:', data);
        // 서버 응답 형식: {"slug":"line4thon", "activeUsers":3}
        if (data && typeof data === 'object') {
          if (data.activeUsers !== undefined) {
            console.log('접속자 수 업데이트:', data.activeUsers);
            setUsernum(data.activeUsers);
          } else if (data[slug] !== undefined) {
            console.log('접속자 수 업데이트:', data[slug]);
            setUsernum(data[slug]);
          } else if (data.count !== undefined) {
            console.log('접속자 수 업데이트:', data.count);
            setUsernum(data.count);
          } else if (typeof data === 'number') {
            console.log('접속자 수 업데이트:', data);
            setUsernum(data);
          }
        }
      });
      
      // 사용자 입장 메시지 전송
      sendJoinMessage(slug);
    };

    const onError = error => {
      console.error('웹소켓 연결 실패:', error);
      // 웹소켓 실패 시 폴링으로 폴백
      fallbackInterval = setInterval(async () => {
        const users = await getActiveUsers(slug);
        if (users !== null && users[slug] !== undefined) {
          setUsernum(users[slug]);
        }
      }, 10000);
    };

    connectSocket(onConnected, onError);

    // cleanup: 컴포넌트 언마운트 시 웹소켓 연결 해제
    return () => {
      if (fallbackInterval) {
        clearInterval(fallbackInterval);
      }
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      disconnectSocket();
    };
  }, [slug, getActiveUsers]);

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
