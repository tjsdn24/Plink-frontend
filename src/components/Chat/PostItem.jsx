import BasicProfile from '../../assets/icons/ChatBasicProfile.svg';
import LikeIcon from '../../assets/icons/ChatLike.svg';
import CommentIcon from '../../assets/icons/ChatComment.svg';
import PostContent from './PostContent';
import PostPoll from './PostPoll';
import {
  PostWrapper,
  ProfileImg,
  PostBox,
  Nickname,
  ContentAndEtcWrapper,
  ContentWrapper,
  Etc,
  Reaction,
  Like,
  Comment,
  ReactionIcon,
  Time,
} from './Post.styles';

export default function PostItem({ post, onCommentClick, onReportOpen, highlightKeyword }) {
  return (
    <PostWrapper>
      <ProfileImg src={BasicProfile} alt="profile" />
      <PostBox>
        <Nickname>{post.nickname}</Nickname>

        <ContentAndEtcWrapper>
          <ContentWrapper>
            {(post.content || []).map((item, i) => {
              if (item.type === 'poll') return <PostPoll key={i} data={item.data} />;
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
            <Reaction>
              <Like>
                <ReactionIcon src={LikeIcon} alt="like" />
                {post.like}
              </Like>
              <Comment onClick={onCommentClick}>
                <ReactionIcon src={CommentIcon} alt="comment" />
                {post.comment}
              </Comment>
            </Reaction>
            <Time>{post.time}</Time>
          </Etc>
        </ContentAndEtcWrapper>
      </PostBox>
    </PostWrapper>
  );
}
