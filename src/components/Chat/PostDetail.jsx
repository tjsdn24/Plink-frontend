import { useState } from 'react';
import LikeIcon from '../../assets/icons/ChatLike.svg';
import ChatLikePink from '../../assets/icons/ChatLikePink.svg';
import CommentIcon from '../../assets/icons/ChatComment.svg';
import BasicProfile from '../../assets/icons/ChatBasicProfile.svg';
import ChatDots from '../../assets/icons/ChatDots.svg';
import ChatPollChecked from '../../assets/icons/ChatPollChecked.svg';
import {
  PostSection,
  Info,
  ProfileImg,
  Section,
  Nickname,
  Time,
  ContentBox,
  ImageGrid,
  PostImage,
  PollBox,
  PollOption,
  PollBar,
  PollText,
  PollTotal,
  Reaction,
  LikeButton,
  CommentCount,
  PollLeft,
  DotButton,
  DotMenuWrapper,
  MenuBox,
  MenuItem,
} from './Comments.styles';

export default function PostDetail({
  post,
  likes: initialLikes,
  liked: initialLiked,
  commentsCount,
  pollVotes,
  onLike,
  onPollVote,
  onEdit,
  onDelete,
  onReport,
}) {
  const [liked, setLiked] = useState(initialLiked || false);
  const [likes, setLikes] = useState(initialLikes || 0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  /** 🔥 투표 데이터 변환 로직 */
  const transformedPollData = post.poll
    ? {
        id: post.poll.pollId,
        options: post.poll.result.map(item => ({
          id: item.optionId,
          text: item.content,
          voteCount: item.voteCount,
        })),
        votes: post.poll.result.map(item => item.voteCount),
        totalVotes: post.poll.totalVotes,
      }
    : null;

  /** ❤️ 좋아요 처리 */
  const handleLike = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const newLiked = !liked;
    setLiked(newLiked);
    setLikes(prev => (newLiked ? prev + 1 : prev - 1));

    try {
      if (onLike) await onLike(post.id, newLiked);
    } catch (error) {
      console.error('좋아요 반영 실패:', error);
      setLiked(!newLiked);
      setLikes(prev => (newLiked ? prev - 1 : prev + 1));
    } finally {
      setIsProcessing(false);
    }
  };

  /** 🗳 투표 클릭 처리 */
  const handleVote = (pollData, index) => {
    setSelectedIndex(index);
    if (onPollVote) onPollVote(pollData, index);
  };

  /** ✏ 수정 */
  const handleEdit = () => {
    setMenuOpen(false);
    if (onEdit) onEdit(post.id);
  };

  /** ❌ 삭제 */
  const handleDelete = () => {
    setMenuOpen(false);
    if (onDelete) onDelete(post.id);
  };

  /** 🚨 신고 */
  const handleReport = () => {
    setMenuOpen(false);
    if (onReport) onReport();
  };

  /** 📄 일반 content 렌더 함수 */
  const renderContent = (item, index) => {
    switch (item.type) {
      case 'text':
        return <ContentBox key={index}>{item.data}</ContentBox>;

      case 'images':
        return (
          <ImageGrid key={index}>
            {item.data.map((url, i) => (
              <PostImage key={i} src={url} alt={`post-image-${i}`} />
            ))}
          </ImageGrid>
        );

      default:
        return null;
    }
  };

  return (
    <PostSection>
      {/* HEADER */}
      <Info>
        <div>
          <ProfileImg src={post.profileImageUrl || BasicProfile} alt="profile" />
          <Section>
            <Nickname>{post.author}</Nickname>
            <Time>{post.createdAt || post.time || '시간 정보 없음'}</Time>
          </Section>
        </div>

        <DotMenuWrapper>
          <DotButton src={ChatDots} alt="options" onClick={() => setMenuOpen(prev => !prev)} />
          {menuOpen && (
            <MenuBox>
              <MenuItem onClick={handleEdit}>수정</MenuItem>
              <MenuItem onClick={handleDelete}>삭제</MenuItem>
              <MenuItem onClick={handleReport}>신고</MenuItem>
            </MenuBox>
          )}
        </DotMenuWrapper>
      </Info>

      {/* 🔥 투표 글이라면 Poll을 최우선으로 렌더 */}
      {post.postType === 'POLL' && transformedPollData && (
        <PollBox>
          {transformedPollData.options.map((option, i) => {
            const votes = transformedPollData.votes[i] || 0;
            const totalVotes = transformedPollData.totalVotes || 0;
            const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
            const isMax = votes === Math.max(...transformedPollData.votes);
            const isMine = selectedIndex === i;

            return (
              <PollOption key={i} $isMax={isMax} onClick={() => handleVote(transformedPollData, i)}>
                <PollBar $percentage={percentage} $isMax={isMax} />
                <PollText>
                  <PollLeft $isMax={isMax}>
                    <span>{option.text}</span>
                    {isMine && <img src={ChatPollChecked} alt="checked" />}
                  </PollLeft>
                  <span>{percentage.toFixed(0)}%</span>
                </PollText>
              </PollOption>
            );
          })}
          <PollTotal>총 {transformedPollData.totalVotes}표</PollTotal>
        </PollBox>
      )}

      {/* 🔽 일반 글 내용 렌더 (투표글이면 제외) */}
      {post.postType !== 'POLL' &&
        (Array.isArray(post?.content)
          ? post.content.map((item, i) => renderContent(item, i))
          : post.content && <ContentBox>{post.content}</ContentBox>)}

      {/* FOOTER - 좋아요/댓글 */}
      <Reaction>
        <LikeButton onClick={handleLike} $liked={liked} disabled={isProcessing}>
          <img src={liked ? ChatLikePink : LikeIcon} alt="like" />
          {likes}
        </LikeButton>

        <CommentCount>
          <img src={CommentIcon} alt="comment" />
          {commentsCount}
        </CommentCount>
      </Reaction>
    </PostSection>
  );
}
