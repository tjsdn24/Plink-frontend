import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PageHeader from '../PageHeader';
import Post from '../Chat/Post';
import SearchIcon from '../../assets/icons/SearchIcon.svg';
import { c, s, typography } from '../../styles/themeUtils';
import { extractSearchableText } from './activityUtils';

const DEFAULT_TABS = [
  { key: 'story', label: '이야기', path: '/mypage/chat' },
  { key: 'empathy', label: '공감', path: '/mypage/like' },
  { key: 'comment', label: '댓글', path: '/mypage/comment' },
];

const filterItems = (items, keyword, type) => {
  if (!keyword.trim()) return items;
  const normalized = keyword.trim().toLowerCase();

  if (type === 'comment') {
    return items.filter(item =>
      [item.commentText, item.postPreview, item.postNickname]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalized)
    );
  }

  return items.filter(post => extractSearchableText(post).includes(normalized));
};

export default function ActivityLayout({
  headerTitle = 'My',
  type,
  items = [],
  activeTab = 'story',
  tabs = DEFAULT_TABS,
  emptyTitle,
  emptyDescription,
  isLoading = false,
  errorMessage = null,
}) {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const filteredItems = useMemo(
    () => filterItems(items, keyword, type),
    [items, keyword, type]
  );

  const hasItems = filteredItems.length > 0;

  const renderStatusCard = (title, description) => (
    <EmptyState>
      <EmptyTitle>{title}</EmptyTitle>
      <EmptyDescription>{description}</EmptyDescription>
    </EmptyState>
  );

  let content;

  if (isLoading) {
    content = renderStatusCard('불러오는 중이에요.', '잠시만 기다려 주세요.');
  } else if (errorMessage) {
    content = renderStatusCard('오류가 발생했어요.', errorMessage);
  } else if (type === 'comment') {
    content = hasItems
      ? (
        <CommentList>
          {filteredItems.map(item => (
            <CommentCard key={item.id}>
              <CommentHeader>
                <CommentBadge>내 댓글</CommentBadge>
                <CommentMeta>{item.time}</CommentMeta>
              </CommentHeader>
              <CommentHighlight>{item.commentText}</CommentHighlight>
              {(item.postPreview || item.postNickname) && (
                <CommentSource>
                  {item.postNickname ? `${item.postNickname} · ` : ''}
                  {item.postPreview || '원문 텍스트 없음'}
                </CommentSource>
              )}
            </CommentCard>
          ))}
        </CommentList>
        )
      : renderStatusCard(emptyTitle, emptyDescription);
  } else {
    content = hasItems
      ? (
        <PostListWrapper>
          <Post postData={filteredItems} />
        </PostListWrapper>
        )
      : renderStatusCard(emptyTitle, emptyDescription);
  }

  return (
    <Screen>
      <PageHeader title={headerTitle} onBack={() => window.history.back()} />
      <PageContainer>

        <SearchBarContainer>
          <SearchBar>
            <SearchInput
              type="text"
              value={keyword}
              onChange={event => setKeyword(event.target.value)}
              placeholder="원하는 이야기를 검색해보세요."
            />
            <SearchIconWrapper>
              <SearchIconImg src={SearchIcon} alt="검색" />
            </SearchIconWrapper>
          </SearchBar>
        </SearchBarContainer>

        <TabsWrapper>
          {tabs.map(tab => (
            <TabButton
              key={tab.key}
              type="button"
              $active={tab.key === activeTab}
              onClick={() => navigate(tab.path)}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabsWrapper>


        <ContentArea>
          {content}
        </ContentArea>
      </PageContainer>
    </Screen>
  );
}

const Screen = styled.div`
  min-height: 100vh;
  background: ${c('neutral.bg')};
  display: flex;
  flex-direction: column;
`;

const PageContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${s('sm')};
  padding: ${s('sm')} ${s('md')} ${s('xl')};
  box-sizing: border-box;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const PageTitle = styled.h2`
  ${typography('headline02')};
  color: ${c('neutral.black')};
  margin: 0;
`;

const TabsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 32px;
  background: transparent;
  padding-top: ${s('xs')};
`;

const TabButton = styled.button`
  flex: 1;
  position: relative;
  border: none;
  background: transparent;
  padding: 10px 0 8px;
  cursor: pointer;
  ${typography('body02')};
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ $active }) => ($active ? c('brand.pink') : c('neutral.black2'))};

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 4px;
    transform: translateX(-50%);
    width: 38%;
    height: 2px;
    border-radius: 999px;
    background: ${c('brand.pink')};
    opacity: ${({ $active }) => ($active ? 1 : 0)};
    transition: opacity 0.2s ease;
  }
`;

const SearchBarContainer = styled.div`
  padding: ${s('xs')} 0;
`;

const SearchBar = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
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

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${s('md')};
  padding-top: ${s('sm')};
`;

const PostListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${s('md')};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${s('sm')};
  padding: ${s('xl')};
  background: ${c('neutral.white')};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid rgba(149, 152, 163, 0.16);
  box-shadow: 0 10px 24px rgba(26, 29, 45, 0.08);
`;

const EmptyTitle = styled.h2`
  margin: 0;
  ${typography('body01')};
  color: ${c('neutral.black')};
`;

const EmptyDescription = styled.p`
  margin: 0;
  ${typography('body02')};
  color: ${c('neutral.black2')};
  text-align: center;
`;

const CommentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${s('md')};
`;

const CommentCard = styled.li`
  background: ${c('neutral.white')};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid rgba(149, 152, 163, 0.12);
  box-shadow: 0 10px 24px rgba(26, 29, 45, 0.08);
  padding: ${s('md')};
  display: flex;
  flex-direction: column;
  gap: ${s('sm')};
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CommentBadge = styled.span`
  background: rgba(249, 64, 158, 0.1);
  color: ${c('brand.pink')};
  padding: 4px 10px;
  border-radius: 999px;
  ${typography('caption01')};
`;

const CommentMeta = styled.span`
  ${typography('caption01')};
  color: ${c('neutral.gray2')};
`;

const CommentHighlight = styled.p`
  margin: 0;
  ${typography('body01')};
  color: ${c('neutral.black')};
  white-space: pre-line;
`;

const CommentSource = styled.span`
  ${typography('body02')};
  color: ${c('neutral.black2')};
`;

