import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import ChatCatagory from '../../components/Chat/ChatCatagory';
import Post from '../../components/Chat/Post';
import NonSearch from '../../components/Chat/NonSearch';
import WriteButton from '../../components/Chat/WriteButton';
import WritePost from '../../components/Chat/WritePost';
import SearchIcon from '../../assets/icons/SearchIcon.svg';
import { c, typography, s } from '../../styles/themeUtils';

import { getPostsByTag, searchPosts } from '../../api/Chat/CommentsApi';

// tagName → tagId 매핑
const tagMap = {
  전체: '',
  '만남/동행': 1,
  '정보/공유': 2,
  '질문/요청': 3,
  분실물: 4,
  '굿즈/이벤트': 5,
  기타: 6,
};

export default function Chat({ slug }) {
  // slug가 props로 안 오면 URL param 등에서 가져올 수도 있음
  if (!slug) slug = 'line4thon';

  const [openWrite, setOpenWrite] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const tagId = tagMap[selectedCategory];

        if (searchKeyword.trim()) {
          console.log('검색 요청:', { slug, keyword: searchKeyword, tagId });

          const res = await searchPosts(slug, searchKeyword, tagId);

          console.log('검색 응답:', res.data);
          setPosts(res.data.posts);
        } else {
          console.log('목록 요청:', { slug, tagId });

          const res = await getPostsByTag(slug, tagId);

          console.log('목록 응답:', res.data);
          setPosts(res.data.posts);
        }
      } catch (err) {
        console.error('게시글 불러오기 실패:', err);
        console.error('응답:', err.response);
      }
    };

    fetchPosts();
  }, [selectedCategory, searchKeyword, slug]);

  const handleAddPost = newPost => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleSearchChange = useCallback(e => {
    setSearchKeyword(e.target.value);
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
          <Post postData={posts} slug={slug} highlightKeyword={searchKeyword} />
        ) : (
          <NonSearch onWrite={() => setOpenWrite(true)} />
        )}

        <WriteButton onClick={() => setOpenWrite(true)} />

        {openWrite && (
          <WritePost slug={slug} onClose={() => setOpenWrite(false)} onAddPost={handleAddPost} />
        )}
      </ChatBottom>
    </ChatWrapper>
  );
}

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
  padding: 0 16px;
`;

const SearchIconImg = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;
