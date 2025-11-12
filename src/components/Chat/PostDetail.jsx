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
}) {
  const [liked, setLiked] = useState(initialLiked || false);
  const [likes, setLikes] = useState(initialLikes || 0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const handleVote = (pollData, index) => {
    setSelectedIndex(index);
    if (onPollVote) onPollVote(pollData, index);
  };

  const handleEdit = () => {
    setMenuOpen(false);
    if (onEdit) onEdit(post.id);
  };

  const handleDelete = () => {
    setMenuOpen(false);
    if (onDelete) onDelete(post.id);
  };

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

      case 'poll': {
        const currentVotes = pollVotes || item.data.votes;
        const totalVotes = currentVotes.reduce((sum, v) => sum + v, 0);
        const maxVotes = Math.max(...currentVotes);

        return (
          <PollBox key={index}>
            {item.data.options.map((option, i) => {
              const votes = currentVotes[i] || 0;
              const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
              const isMax = votes === maxVotes && totalVotes > 0;
              const isMine = selectedIndex === i;

              return (
                <PollOption key={i} $isMax={isMax} onClick={() => handleVote(item.data, i)}>
                  <PollBar $percentage={percentage} $isMax={isMax} />
                  <PollText>
                    <PollLeft $isMax={isMax}>
                      <span>{option}</span>
                      {isMine && <img src={ChatPollChecked} alt="checked" />}
                    </PollLeft>
                    <span>{percentage.toFixed(0)}%</span>
                  </PollText>
                </PollOption>
              );
            })}
            <PollTotal>총 {totalVotes}표</PollTotal>
          </PollBox>
        );
      }
      default:
        return null;
    }
  };

  return (
    <PostSection>
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
            </MenuBox>
          )}
        </DotMenuWrapper>
      </Info>

      {Array.isArray(post?.content) ? (
        post.content.map((item, i) => renderContent(item, i))
      ) : (
        <ContentBox>{post.content}</ContentBox>
      )}

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
