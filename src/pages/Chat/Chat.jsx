//Chat.jsx

import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import ChatCatagory from '../../components/Chat/ChatCatagory';
import Post from '../../components/Chat/Post';
import NonSearch from '../../components/Chat/NonSearch';
import WriteButton from '../../components/Chat/WriteButton';
import WritePost from '../../components/Chat/WritePost';
import SearchIcon from '../../assets/icons/SearchIcon.svg';
import { c, s, typography } from '../../styles/themeUtils';

import { getPostsByTag, searchPosts } from '../../api/Chat/CommentsApi';

export default function Chat() {
  const [openWrite, setOpenWrite] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchKeyword, setSearchKeyword] = useState('');

  const slug = 'line4thon';

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (searchKeyword.trim()) {
          // 검색 시 - 카테고리 필터링도 함께 적용
          const tag = selectedCategory === '전체' ? '' : selectedCategory;
          console.log('검색 요청:', { slug, keyword: searchKeyword, tag });

          const res = await searchPosts(slug, searchKeyword, tag);

          console.log('검색 API 응답:', res);
          console.log('검색 API 응답 데이터:', res.data);
          console.log('검색된 게시글 수:', res.data.posts.length);

          setPosts(res.data.posts);
        } else {
          // 검색어 없을 때 - 카테고리별 목록
          const tag = selectedCategory === '전체' ? '' : selectedCategory;
          console.log('목록 요청:', { slug, tag });

          const res = await getPostsByTag(slug, tag);

          console.log('목록 API 응답:', res.data);
          console.log('불러온 게시글 수:', res.data.posts.length);

          setPosts(res.data.posts);
        }
      } catch (err) {
        console.error('=== 게시글 불러오기 실패 ===');
        console.error('에러:', err);
        console.error('에러 응답:', err.response);
        console.error('에러 데이터:', err.response?.data);
      }
    };

    fetchPosts();
  }, [selectedCategory, searchKeyword]);

  const handleAddPost = newPost => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleSearchChange = useCallback(event => {
    setSearchKeyword(event.target.value);
  }, []);

  return (
    <ChatWrapper>
      <ChatTop>
        <SearchBarContainer>
          <SearchBar>
            <SearchInput
              id="chat-search"
              name="search"
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
        {posts.length > 0 ? (
          <Post postData={posts} highlightKeyword={searchKeyword} />
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
