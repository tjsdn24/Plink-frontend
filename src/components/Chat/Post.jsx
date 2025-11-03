import styled from 'styled-components';
import BasicProfile from '../../assets/icons/BasicProfile.svg';
import LikeIcon from '../../assets/icons/Like.svg';
import CommentIcon from '../../assets/icons/Comment.svg';
import ReportIcon from '../../assets/icons/Report.svg';
import { f, c } from '../../styles/themeUtils';
import { postData } from './Posts';

export default function Post() {
  const renderContent = (contentItem, index) => {
    switch (contentItem.type) {
      case 'text':
        return (
          <ContentRow key={index}>
            <ContentBox>{contentItem.data}</ContentBox>
            <Report src={ReportIcon} alt="report" />
          </ContentRow>
        );

      case 'images':
        return (
          <ContentRow key={index}>
            <ImagesWrapper>
              {contentItem.data.map((imageUrl, imgIndex) => (
                <PostImage key={imgIndex} src={imageUrl} alt={`post-${imgIndex}`} />
              ))}
            </ImagesWrapper>
          </ContentRow>
        );

      case 'poll':
        return (
          <ContentRow key={index}>
            <PollWrapper>
              {contentItem.data.options.map((option, optionIndex) => (
                <PollOption key={optionIndex}>
                  <PollText>{option}</PollText>
                  <PollVotes>{contentItem.data.votes[optionIndex]}</PollVotes>
                </PollOption>
              ))}
            </PollWrapper>
          </ContentRow>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <ChatWrapper>
        {postData.map(post => (
          <PostWrapper key={post.id}>
            <ProfileImg src={BasicProfile} alt="profile" />
            <PostBox>
              <Nickname>{post.nickname}</Nickname>

              <ContentAndEtcWrapper>
                <ContentWrapper>
                  {post.content.map((contentItem, index) => renderContent(contentItem, index))}
                </ContentWrapper>

                <Etc>
                  <Reaction>
                    <Like>
                      <ReactionIcon src={LikeIcon} alt="like" />
                      {post.like}
                    </Like>
                    <Comment>
                      <ReactionIcon src={CommentIcon} alt="comment" />
                      {post.comment}
                    </Comment>
                  </Reaction>
                  <Time>{post.time}</Time>
                </Etc>
              </ContentAndEtcWrapper>
            </PostBox>
          </PostWrapper>
        ))}
      </ChatWrapper>
    </>
  );
}

const ChatWrapper = styled.div`
  background-color: #fff;
`;

const PostWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  background-color: ${c('neutral.white')};
  font-family: ${f('family.display01')};
`;

const ProfileImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  flex-shrink: 0;
`;

const PostBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Nickname = styled.div`
  font-weight: 500;
  font-size: 14px;
`;

const ContentAndEtcWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: fit-content;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ContentRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 10px;
`;

const ContentBox = styled.div`
  background-color: ${c('neutral.bg')};
  padding: 10px 14px;
  border-radius: 10px;
  line-height: 1.4;
  font-size: 14px;
  color: #333;
`;

const ImagesWrapper = styled.div`
  display: flex;
  gap: 8px;
  background-color: ${c('neutral.bg')};
  padding: 10px;
  border-radius: 10px;
`;

const PostImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
`;

const PollWrapper = styled.div`
  background-color: ${c('neutral.bg')};
  padding: 10px 14px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
`;

const PollOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: ${c('neutral.white')};
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const PollText = styled.span`
  font-size: 14px;
  color: #333;
`;

const PollVotes = styled.span`
  font-size: 12px;
  color: ${c('neutral.gray2')};
  font-weight: 600;
`;

const Report = styled.img`
  width: 18px;
  height: 18px;
  cursor: pointer;
  flex-shrink: 0;
`;

const Etc = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Reaction = styled.div`
  display: flex;
  gap: 10px;
`;

const ReactionIcon = styled.img`
  width: 18px;
  height: 18px;
  margin-right: 4px;
`;

const Like = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${c('neutral.black')};
`;

const Comment = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${c('neutral.black')};
`;

const Time = styled.div`
  font-size: 12px;
  color: ${c('neutral.gray2')};
`;
