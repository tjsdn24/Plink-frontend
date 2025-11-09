import LikeIcon from '../../assets/icons/ChatLike.svg';
import ChatLikePink from '../../assets/icons/ChatLikePink.svg';
import CommentIcon from '../../assets/icons/ChatComment.svg';
import BasicProfile from '../../assets/icons/ChatBasicProfile.svg';
import ChatDots from '../../assets/icons/ChatDots.svg';
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
} from './Comments.styles';

export default function PostDetail({
  post,
  likes,
  liked,
  commentsCount,
  pollVotes,
  onLike,
  onPollVote,
}) {
  const renderContent = (item, index) => {
    console.log('renderContent 호출:', item);
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

        return (
          <PollBox key={index}>
            {item.data.options.map((option, i) => {
              const votes = currentVotes[i] || 0;
              const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;

              return (
                <PollOption key={i} onClick={() => onPollVote(item.data, i)}>
                  <PollBar $percentage={percentage} />
                  <PollText>
                    <span>{option}</span>
                    <span>
                      {votes}표 ({percentage.toFixed(0)}%)
                    </span>
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
        <ProfileImg src={BasicProfile} alt="profile" />
        <Section>
          <Nickname>{post.nickname}</Nickname>
          <Time>{post.time}</Time>
        </Section>
        <img src={ChatDots} alt="options" />
      </Info>

      {Array.isArray(post?.content) && post.content.map((item, i) => renderContent(item, i))}

      <Reaction>
        <LikeButton onClick={onLike} $liked={liked}>
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
