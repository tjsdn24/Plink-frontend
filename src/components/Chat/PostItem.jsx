//PostItem.jsx

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
  //  onReportOpen,
  highlightKeyword,
  onLike,
  onPollVote,
}) {
  const [liked, setLiked] = useState(post.liked || false);
  const [likesCount, setLikesCount] = useState(post.like || 0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pollVotes, setPollVotes] = useState(
    Array.isArray(post.content)
      ? post.content.find(item => item.type === 'poll')?.data?.votes || []
      : []
  );

  const handleLike = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(prev => (newLiked ? prev + 1 : prev - 1));

    try {
      if (onLike) await onLike(post.id, newLiked);
    } catch (error) {
      console.error('좋아요 반영 실패:', error);
      setLiked(!newLiked);
      setLikesCount(prev => (newLiked ? prev - 1 : prev + 1));
    } finally {
      setIsProcessing(false);
    }
  };

  // 투표 반영 핸들러
  const handlePollVote = (pollData, index) => {
    const newVotes = [...pollVotes];
    newVotes[index] = (newVotes[index] || 0) + 1;
    setPollVotes(newVotes);

    if (onPollVote) onPollVote(pollData, index);
  };

  return (
    <PostWrapper>
      <ProfileImg src={post.profileImageUrl || BasicProfile} alt="profile" />
      <PostBox>
        <div>
          <Nickname>{post.author || post.nickname}</Nickname>
        </div>
        <ContentAndEtcWrapper>
          <ContentWrapper>
            {post.postType === 'POLL' && post.poll ? (
              <PostPollDetail
                pollData={post.poll}
                pollVotes={pollVotes}
                onPollVote={handlePollVote}
              />
            ) : (
              <PostContent
                contentItem={{ type: 'text', data: post.content }}
                highlightKeyword={highlightKeyword}
                post={post}
              />
            )}
          </ContentWrapper>

          <Etc>
            <Like onClick={handleLike} disabled={isProcessing}>
              <ReactionIcon src={liked ? ChatLikePink : LikeIcon} alt="like" />
              {likesCount}
            </Like>

            <Comment onClick={onCommentClick}>
              <ReactionIcon src={CommentIcon} alt="comment" />
              {post.commentCount || 0}
            </Comment>

            <Time>{new Date(post.createdAt).toLocaleString()}</Time>
          </Etc>
        </ContentAndEtcWrapper>
      </PostBox>
    </PostWrapper>
  );
}
