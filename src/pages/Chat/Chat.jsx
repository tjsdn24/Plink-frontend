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

  //고유 ID 생성 함수
  const generateId = () => Date.now() + Math.random().toString(36).substr(2, 9);

  //localStorage에서 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('posts');
    let loaded = saved ? JSON.parse(saved) : initialData;

    //id가 없는 게시글에 자동으로 id 추가
    const withIds = loaded.map(post => (post.id ? post : { ...post, id: generateId() }));

    setPosts(withIds);

    localStorage.setItem('posts', JSON.stringify(withIds));
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
    const id = generateId();
    const postWithId = { ...newPost, id };

    setPosts(prev => {
      const updated = [postWithId, ...prev];
      localStorage.setItem('posts', JSON.stringify(updated));
      return updated;
    });
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
