import BasicProfile from '../../assets/icons/ChatBasicProfile.svg';
import LikeButton from '../Chat/LikeButton';
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
  Comment,
  ReactionIcon,
  Time,
} from './Post.styles';

export default function PostItem({ post, onCommentClick, highlightKeyword, onLike, onPollVote }) {
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
            {/* ❤️ 공통 LikeButton 사용 */}
            <LikeButton
              liked={post.liked}
              count={post.likeCount}
              onToggle={() => onLike && onLike(post.id)}
            />

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
