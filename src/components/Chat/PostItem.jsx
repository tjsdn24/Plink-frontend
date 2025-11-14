import BasicProfile from '../../assets/icons/ChatBasicProfile.svg';
import LikeButton from '../Chat/LikeButton';
import CommentIcon from '../../assets/icons/ChatComment.svg';
import PostContent from './PostContent';
import PostPollDetail from './PostPollDetail';
import { votePoll } from '../../api/Chat/voteApi';
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

export default function PostItem({ post, onCommentClick, highlightKeyword, slug }) {
  const initPost = usePostStore(state => state.initPost);

  initPost(post.id, post.liked, post.likeCount);

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

  const onPollVote = async (pollId, optionId) => {
    await votePoll(slug, pollId, optionId);
  };

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
                slug={slug}
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
