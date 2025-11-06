import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Search from '../../components/Chat/Search';
import ChatCatagory from '../../components/Chat/ChatCatagory';
import Post from '../../components/Chat/Post';
import WriteButton from '../../components/Chat/WriteButton';
import WritePost from '../../components/Chat/WritePost';
import { postData as initialData } from '../../components/Chat/PostData.js';
import { c } from '../../styles/themeUtils';

export default function Chat() {
  const [openWrite, setOpenWrite] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const isFirstLoad = useRef(true);

  //localStorage에서 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('posts');
    if (saved) {
      setPosts(JSON.parse(saved));
    } else {
      setPosts(initialData);
    }
  }, []);

  //posts 변경 시 localStorage에 자동 저장
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  //새로운 글 추가
  const handleAddPost = newPost => {
    setPosts(prev => [newPost, ...prev]);
  };

  // 카테고리 필터링
  const filteredPosts =
    selectedCategory === '전체' ? posts : posts.filter(post => post.category === selectedCategory);

  return (
    <ChatWrapper>
      <ChatTop>
        <Search />
        <ChatCatagory selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      </ChatTop>
      <ChatBottom>
        <Post postData={filteredPosts} />
        <WriteButton onClick={() => setOpenWrite(true)} />
        {openWrite && <WritePost onClose={() => setOpenWrite(false)} onAddPost={handleAddPost} />}
      </ChatBottom>
    </ChatWrapper>
  );
}

const ChatWrapper = styled.div`
  // background-color: ${c('neutral.white')};
  //height: 100%;
`;

const ChatTop = styled.div`
  background: ${c('neutral.bg')};
`;

const ChatBottom = styled.div``;
