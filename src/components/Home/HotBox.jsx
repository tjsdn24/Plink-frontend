import TitleBar from './TitleBar';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { c, f, s } from '../../styles/themeUtils';
import { BoxContainer } from './BoxContainer';
import talkIcon from '../../assets/icons/HomeTalk.svg';
import HotChat from '../Home/HotChat';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function HotBox() {
  const navigate = useNavigate();
  const [popularPosts, setPopularPosts] = useState([]);

  function timeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const diff = now - past;

    const min = diff / 1000 / 60;
    const hour = min / 60;
    const day = hour / 24;

    if (min < 1) return '방금 전';
    if (min < 60) return `${Math.floor(min)}분 전`;
    if (hour < 24) return `${Math.floor(hour)}시간 전`;
    return `${Math.floor(day)}일 전`;
  }

  async function fetchData() {
    try {
      const response = await axios.get('http://15.165.177.229:8080/line4thon/main/popular');

      setPopularPosts(response.data.popularPosts);
    } catch (error) {
      console.error('데이터 불러오기 실패:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <BoxContainer>
      <TitleBar
        imageurl={talkIcon}
        title="인기있는 이야기"
        description="현재 가장 주목받는 이야기들은?"
        onClick={() => navigate('/chat')}
      />

      {popularPosts.map(post => (
        <HotChat
          key={post.id}
          image={post.profileImageUrl}
          nickname={post.author}
          time={timeAgo(post.updatedAt)}
          content={post.content}
        />
      ))}
    </BoxContainer>
  );
}
