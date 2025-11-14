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
  PollTitle,
} from './Post.styles';

import { usePostStore } from '../../store/postStore';

export default function PostDetail({ post, slug, onCommentClick, highlightKeyword, onPollVote }) {
  const initPost = usePostStore(state => state.initPost);

  // 상세 페이지에서도 초기값 세팅 필수
  initPost(post.id, post.liked, post.likeCount);

  // poll 데이터 변환
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
          {post.postType === 'POLL' && post.title && <PollTitle>{post.title}</PollTitle>}
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
            {/* 상세 페이지도 전역 LikeButton 사용 */}
            <LikeButton postId={post.id} slug={slug} />

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
