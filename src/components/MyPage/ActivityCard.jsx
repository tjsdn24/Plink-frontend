import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BasicProfile from '../../assets/icons/ChatBasicProfile.svg';
import ChatLikePink from '../../assets/icons/ChatLikePink.svg';
import CommentIcon from '../../assets/icons/ChatComment.svg';
import ChatDots from '../../assets/icons/ChatDots.svg';
import { c, s, typography } from '../../styles/themeUtils';
import { getPostPreview } from './activityUtils';

export default function ActivityCard({ 
  item, 
  type, // 'story' | 'empathy' | 'comment'
  slug = 'line4thon',
  onClick 
}) {
  const navigate = useNavigate();

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

  // 좋아요 수
  const likeCount = item.likeCount || item.like || 0;
  
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
      navigate(`/chat/${slug}/post/${postId}`, {
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
          <ReactionItem>
            <ReactionIcon src={ChatLikePink} alt="like" />
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

