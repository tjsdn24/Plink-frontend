import { useState } from 'react';
import BasicProfile from '../../assets/icons/ChatBasicProfile.svg';
import LikeIcon from '../../assets/icons/ChatLike.svg';
import ChatLikePink from '../../assets/icons/ChatLikePink.svg';
import CommentIcon from '../../assets/icons/ChatComment.svg';
import PostContent from './PostContent';
import PostPollDetail from './PostPollDetail';
import {
  PostWrapper,
  ProfileImg,
  PostBox,
  Nickname,
  ContentAndEtcWrapper,
  ContentWrapper,
  Etc,
  Like,
  Comment,
  ReactionIcon,
  Time,
} from './Post.styles';

export default function PostItem({
  post,
  onCommentClick,
  onReportOpen,
  highlightKeyword,
  onLike,
  onPollVote,
}) {
  const [liked, setLiked] = useState(post.liked || false);
  const [likesCount, setLikesCount] = useState(post.like || 0);
  const [isProcessing, setIsProcessing] = useState(false); // 중복 클릭 방지용

  const handleLike = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const newLiked = !liked;

    setLiked(newLiked);
    setLikesCount(prev => (newLiked ? prev + 1 : prev - 1));

    try {
      //백엔드 연동 시 교체
      // 예: await api.post(`/posts/${post.id}/like`, { liked: newLiked });
      if (onLike) await onLike(post.id, newLiked);
    } catch (error) {
      console.error('좋아요 반영 실패:', error);

      // 실패 시 UI 롤백
      setLiked(!newLiked);
      setLikesCount(prev => (newLiked ? prev - 1 : prev + 1));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PostWrapper>
      <ProfileImg src={BasicProfile} alt="profile" />
      <PostBox>
        <div>
          <Nickname>{post.nickname}</Nickname>
        </div>
        <ContentAndEtcWrapper>
          <ContentWrapper>
            {(post.content || []).map((item, i) => {
              if (item.type === 'poll') {
                return (
                  <PostPollDetail
                    key={i}
                    pollData={item.data}
                    onPollVote={(pollData, index) => {
                      if (onPollVote) onPollVote(pollData, index);
                    }}
                  />
                );
              }
              return (
                <PostContent
                  key={i}
                  contentItem={item}
                  highlightKeyword={highlightKeyword}
                  onReportClick={onReportOpen}
                />
              );
            })}
          </ContentWrapper>

          <Etc>
            <Like onClick={handleLike} disabled={isProcessing}>
              <ReactionIcon src={liked ? ChatLikePink : LikeIcon} alt="like" />
              {likesCount}
            </Like>

            <Comment onClick={onCommentClick}>
              <ReactionIcon src={CommentIcon} alt="comment" />
              {post.comment}
            </Comment>

            <Time>{post.time}</Time>
          </Etc>
        </ContentAndEtcWrapper>
      </PostBox>
    </PostWrapper>
  );
}
