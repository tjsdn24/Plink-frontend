import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BasicProfile from '../../assets/icons/ChatBasicProfile.svg';
import ChatLikePink from '../../assets/icons/ChatLikePink.svg';
import ChatLike from '../../assets/icons/ChatLike.svg';
import CommentIcon from '../../assets/icons/ChatComment.svg';
import ChatDots from '../../assets/icons/ChatDots.svg';
import { c, s, typography } from '../../styles/themeUtils';
import { getPostPreview } from './activityUtils';
import { likePost } from '../../api/Chat/CommentsApi';

export default function ActivityCard({ 
  item, 
  type, // 'story' | 'empathy' | 'comment'
  slug = 'line4thon',
  onClick 
}) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(item.liked || false);
  const [likeCount, setLikeCount] = useState(item.likeCount || item.like || 0);
  const [isLiking, setIsLiking] = useState(false);

  // 공감하기 핸들러
  const handleLike = async (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    
    if (isLiking) return;
    
    const postId = item.postId || item.id;
    if (!postId) return;

    setIsLiking(true);
    const previousLiked = isLiked;
    const previousCount = likeCount;

    // 낙관적 업데이트
    setIsLiked(!previousLiked);
    setLikeCount(previousLiked ? previousCount - 1 : previousCount + 1);

    try {
      await likePost(slug, postId);
      // 성공 시 상태는 이미 업데이트됨
      
      // 좋아요 취소 시 (공감한 글 보기에서만) 목록에서 제거 이벤트 발생
      // previousLiked가 true였고, 현재 취소된 경우
      if (type === 'empathy' && previousLiked) {
        window.dispatchEvent(new CustomEvent('removeLikedPost', {
          detail: { postId }
        }));
      }
    } catch (error) {
      console.error('공감하기 실패:', error);
      // 실패 시 롤백
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
      alert('공감하기에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLiking(false);
    }
  };

  // 게시글 본문 텍스트 추출
  const getContentText = () => {
    if (type === 'comment') {
      return item.commentText || item.content || '';
    }
    
    // 게시글인 경우
    // 문자열인 경우
    if (typeof item.content === 'string') {
      return item.content;
    }
    
    // 배열인 경우 (contentItems 또는 content)
    if (Array.isArray(item.content) || Array.isArray(item.contentItems)) {
      const contentArray = item.content || item.contentItems || [];
      // 텍스트 타입 항목 찾기
      const textItems = contentArray
        .filter(item => item?.type === 'text' && item?.data)
        .map(item => item.data);
      
      if (textItems.length > 0) {
        return textItems.join(' ');
      }
      
      // getPostPreview 사용
      return getPostPreview(item) || '';
    }
    
    return '';
  };

  // 댓글 수
  const commentCount = item.commentCount || item.comments?.length || 0;
  
  // 시간 정보
  const time = item.time || item.createdAt || '';

  // 클릭 핸들러
  const handleClick = () => {
    if (onClick) {
      onClick(item);
    } else if (item.postId || item.id) {
      const postId = item.postId || item.id;
      // 댓글의 경우 postId로 이동, 좋아요/게시글의 경우 id로 이동
      navigate(`/chat/post/${postId}`, {
        state: { post: item },
      });
    }
  };

  return (
    <Card onClick={handleClick}>
      {/* 좋아요한 이야기에서만 작성자 정보 표시 */}
      {type === 'empathy' && (item.author || item.nickname) && (
        <AuthorInfo>
          <ProfileImg 
            src={item.profileImageUrl || BasicProfile} 
            alt="profile" 
          />
          <AuthorName>{item.author || item.nickname}</AuthorName>
        </AuthorInfo>
      )}

      {/* 본문 */}
      <ContentText>{getContentText()}</ContentText>

      {/* 하단 정보 */}
      <Footer>
        <Reactions>
          <ReactionItem onClick={handleLike} $clickable>
            <ReactionIcon src={isLiked ? ChatLikePink : ChatLike} alt="like" />
            <ReactionCount>{likeCount}</ReactionCount>
          </ReactionItem>
          <ReactionItem>
            <ReactionIcon src={CommentIcon} alt="comment" />
            <ReactionCount>{commentCount}</ReactionCount>
          </ReactionItem>
        </Reactions>
        <TimeText>{time}</TimeText>
        <MenuButton onClick={(e) => {
          e.stopPropagation();
          // 메뉴 기능은 필요시 추가
        }}>
          <MenuIcon src={ChatDots} alt="menu" />
        </MenuButton>
      </Footer>
    </Card>
  );
}

const Card = styled.div`
  background: ${c('neutral.white')};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid rgba(149, 152, 163, 0.12);
  box-shadow: 0 10px 24px rgba(26, 29, 45, 0.08);
  padding: ${s('md')};
  display: flex;
  flex-direction: column;
  gap: ${s('sm')};
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(26, 29, 45, 0.12);
  }
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${s('sm')};
  margin-bottom: ${s('xs')};
`;

const ProfileImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const AuthorName = styled.span`
  ${typography('body01')};
  color: ${c('neutral.black')};
  font-weight: 500;
`;

const ContentText = styled.p`
  margin: 0;
  ${typography('body01')};
  color: ${c('neutral.black')};
  white-space: pre-line;
  line-height: 1.5;
  flex: 1;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${s('xs')};
`;

const Reactions = styled.div`
  display: flex;
  align-items: center;
  gap: ${s('md')};
`;

const ReactionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  transition: opacity 0.2s ease;
  
  ${({ $clickable }) =>
    $clickable &&
    `
    &:hover {
      opacity: 0.7;
    }
    &:active {
      opacity: 0.5;
    }
  `}
`;

const ReactionIcon = styled.img`
  width: 18px;
  height: 18px;
`;

const ReactionCount = styled.span`
  ${typography('body02')};
  color: ${c('neutral.black2')};
`;

const TimeText = styled.span`
  ${typography('caption01')};
  color: ${c('neutral.gray2')};
  margin-left: auto;
  margin-right: ${s('sm')};
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MenuIcon = styled.img`
  width: 20px;
  height: 20px;
  opacity: 0.6;
`;

