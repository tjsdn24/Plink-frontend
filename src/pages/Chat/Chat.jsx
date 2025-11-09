import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import styled from 'styled-components';
import ChatCatagory from '../../components/Chat/ChatCatagory';
import Post from '../../components/Chat/Post';
import NonSearch from '../../components/Chat/NonSearch';
import WriteButton from '../../components/Chat/WriteButton';
import WritePost from '../../components/Chat/WritePost';
import { postData as initialData } from '../../components/Chat/PostData.js';
import SearchIcon from '../../assets/icons/SearchIcon.svg';
import { c, s, typography } from '../../styles/themeUtils';

export default function Chat() {
  const [openWrite, setOpenWrite] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchKeyword, setSearchKeyword] = useState('');
  const isFirstLoad = useRef(true);

  //고유 ID 생성 함수
  const generateId = () => Date.now() + Math.random().toString(36).substr(2, 9);

  //localStorage에서 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('posts');
    let loaded = [];

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loaded = parsed;
        } else {
          loaded = initialData;
        }
      } catch {
        loaded = initialData;
      }
    } else {
      loaded = initialData;
    }

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
  const filteredPosts = useMemo(() => {
    const categoryFiltered =
      selectedCategory === '전체'
        ? posts
        : posts.filter(post => post.category === selectedCategory);

    if (!searchKeyword.trim()) return categoryFiltered;

    const keyword = searchKeyword.trim().toLowerCase();

    return categoryFiltered.filter(post =>
      post.content.some(item => {
        if (item.type !== 'text' || typeof item.data !== 'string') return false;
        return item.data.toLowerCase().includes(keyword);
      })
    );
  }, [posts, selectedCategory, searchKeyword]);

  const handleSearchChange = useCallback(event => {
    setSearchKeyword(event.target.value);
  }, []);

  return (
    <ChatWrapper>
      <ChatTop>
        <SearchBarContainer>
          <SearchBar>
            <SearchInput
              type="text"
              value={searchKeyword}
              onChange={handleSearchChange}
              placeholder="원하는 이야기를 검색해보세요."
            />
            <SearchIconWrapper>
              <SearchIconImg src={SearchIcon} alt="검색" />
            </SearchIconWrapper>
          </SearchBar>
        </SearchBarContainer>
        <ChatCatagory selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      </ChatTop>

      <ChatBottom>
        {filteredPosts.length > 0 ? (
          <Post postData={filteredPosts} highlightKeyword={searchKeyword} />
        ) : (
          <NonSearch onWrite={() => setOpenWrite(true)} />
        )}
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

const SearchBarContainer = styled.div`
  padding: ${s('xs')} 0;
`;

const SearchBar = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 16px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 48px 12px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: ${c('neutral.white')};
  ${typography('body01')};
  color: ${c('neutral.black')};
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: ${c('neutral.gray2')};
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  right: 16px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  padding: 0 16px;
`;

const SearchIconImg = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;
