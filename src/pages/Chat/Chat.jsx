import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import ChatCatagory from '../../components/Chat/ChatCatagory';
import Post from '../../components/Chat/Post';
import NonSearch from '../../components/Chat/NonSearch';
import WriteButton from '../../components/Chat/WriteButton';
import WritePost from '../../components/Chat/WritePost';
import SearchIcon from '../../assets/icons/SearchIcon.svg';
import { c, typography, s } from '../../styles/themeUtils';
import { categories } from '../../components/Chat/Categories';

import { getPostsByTag, searchPosts } from '../../api/Chat/CommentsApi';
import { canWritePost } from '../../utils/guestSession';

/* ----------------------------------------------------
    태그 매핑
----------------------------------------------------- */

export default function Chat({ slug = 'line4thon' }) {
  const [openWrite, setOpenWrite] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchKeyword, setSearchKeyword] = useState('');

  const slug = 'line4thon';

  const handleWriteClick = () => {
    if (!canWritePost()) {
      alert('게시글을 작성하려면 로그인이 필요합니다. 로그인해주세요.');
      return;
    }
    setOpenWrite(true);
  };

  /* ----------------------------------------------------
      게시글 불러오기
  ----------------------------------------------------- */
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // tagName 매핑 (여기가 중요!)
        const tagMap = Object.fromEntries(categories.map(cat => [cat.name, cat.tagName]));
        const tagName = tagMap[selectedCategory] ?? null;

        // 검색
        if (searchKeyword.trim()) {
          const res = await searchPosts(slug, searchKeyword, tagName);
          setPosts(res.data.posts);
        }
        // 카테고리 조회
        else {
          const res = await getPostsByTag(slug, tagName);
          setPosts(res.data.posts);
        }
      } catch (err) {
        console.error('게시글 불러오기 실패:', err);
      }
    };

    fetchPosts();
  }, [selectedCategory, searchKeyword, slug]);

  /* 새로운 게시글 추가 시 */
  const handleAddPost = newPost => {
    setPosts(prev => [newPost, ...prev]);
  };

  /* 검색 */
  const handleSearchChange = useCallback(e => {
    setSearchKeyword(e.target.value);
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
        {posts.length > 0 ? (
          <Post postData={posts} slug={slug} highlightKeyword={searchKeyword} />
        ) : (
          <NonSearch onWrite={handleWriteClick} />
        )}
        <WriteButton onClick={handleWriteClick} />
        {openWrite && <WritePost onClose={() => setOpenWrite(false)} onAddPost={handleAddPost} />}
      </ChatBottom>
    </ChatWrapper>
  );
}

/* -------------------------------- 스타일 -------------------------------- */

const ChatWrapper = styled.div``;

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
`;

const SearchIconImg = styled.img`
  width: 20px;
  height: 20px;
`;
