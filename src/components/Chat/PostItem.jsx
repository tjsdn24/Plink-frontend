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

export default function PostItem({ post, onCommentClick, highlightKeyword, onLike, onPollVote }) {
  const [liked, setLiked] = useState(post.liked || false);
  const [likesCount, setLikesCount] = useState(post.likeCount || 0);
  const [isProcessing, setIsProcessing] = useState(false);

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

  // poll 데이터를 PostPollDetail에 맞게 변환
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

  return (
    <PostWrapper>
      <ProfileImg src={post.profileImageUrl || BasicProfile} alt="profile" />
      <PostBox>
        <div>
          <Nickname>{post.author || post.nickname}</Nickname>
        </div>
        <ContentAndEtcWrapper>
          <ContentWrapper>
            {post.postType === 'POLL' && transformedPollData ? (
              <PostPollDetail
                pollData={transformedPollData}
                pollVotes={transformedPollData.votes}
                onPollVote={onPollVote}
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
