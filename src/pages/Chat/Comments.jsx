import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LikeIcon from '../../assets/icons/ChatLike.svg';
import ChatLikePink from '../../assets/icons/ChatLikePink.svg';
import CommentIcon from '../../assets/icons/ChatComment.svg';
import BasicProfile from '../../assets/icons/ChatBasicProfile.svg';
import ChatArrowLeft from '../../assets/icons/ChatArrowLeft.svg';
import ChatDots from '../../assets/icons/ChatDots.svg';
import ReportIcon from '../../assets/icons/ChatReport.svg';
import ChatSend from '../../assets/icons/ChatSend.svg';
import { c } from '../../styles/themeUtils';
import Report from '../../components/Chat/Report';

export default function Comments() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { post } = state || {};
  const { postId } = useParams();

  const [comments, setComments] = useState(post?.comments || []);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(post?.like || 0);
  const [liked, setLiked] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [pollVotes, setPollVotes] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const [selectedPollOption, setSelectedPollOption] = useState(null);

  const [commentLikes, setCommentLikes] = useState(
    comments.map(() => ({ liked: false, count: 0 }))
  );

  const commentsEndRef = useRef(null);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  // 투표 데이터 초기화
  useEffect(() => {
    if (post?.content) {
      const pollItem = post.content.find(item => item.type === 'poll');
      if (pollItem?.data) {
        setPollVotes(pollItem.data.votes || []);
      }
    }
  }, [post]);

  const openReport = () => setIsReportOpen(true);
  const closeReport = () => setIsReportOpen(false);

  const handleCommentLike = index => {
    setCommentLikes(prev => {
      const updated = [...prev];
      const target = updated[index];
      updated[index] = {
        liked: !target.liked,
        count: target.liked ? target.count - 1 : target.count + 1,
      };
      return updated;
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const newEntry = {
      nickname: '나',
      text: newComment,
      time: '방금 전',
      isMine: true,
    };
    setComments(prev => [...prev, newEntry]);
    setCommentLikes(prev => [...prev, { liked: false, count: 0 }]);
    setNewComment('');
  };

  const handleLike = () => {
    setLikes(prev => (liked ? prev - 1 : prev + 1));
    setLiked(!liked);
  };

  const handlePollVote = (pollData, optionIndex) => {
    setPollVotes(prev => {
      const newVotes = [...(prev || pollData.votes)];
      newVotes[optionIndex] = (newVotes[optionIndex] || 0) + 1;
      return newVotes;
    });
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

        return (
          <PollBox key={index}>
            {item.data.options.map((option, i) => {
              const votes = currentVotes[i] || 0;
              const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;

              return (
                <PollOption key={i} onClick={() => handlePollVote(item.data, i)}>
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

  if (!post) {
    return <div>게시글 정보를 불러올 수 없습니다. (id: {postId})</div>;
  }

  return (
    <>
      <Wrapper>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <img src={ChatArrowLeft} alt="back" />
          </BackButton>
          <HeaderTitle>Talk</HeaderTitle>
        </Header>

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
            <LikeButton onClick={handleLike} $liked={liked}>
              <img src={liked ? ChatLikePink : LikeIcon} alt="like" />
              {likes}
            </LikeButton>
            <CommentCount>
              <img src={CommentIcon} alt="comment" />
              {comments.length}
            </CommentCount>
          </Reaction>
        </PostSection>

        <CommentSection>
          {comments.map((c, i) => (
            <CommentBox key={i} $mine={c.isMine}>
              {!c.isMine && <ProfileImg src={BasicProfile} alt="profile" />}
              <CommentContent $mine={c.isMine}>
                <CommentHeader>
                  <strong>{c.nickname}</strong>
                </CommentHeader>
                <CommentBubble $mine={c.isMine}>{c.text}</CommentBubble>
                <CommentFooter>
                  <LikeButton onClick={() => handleCommentLike(i)} $liked={commentLikes[i]?.liked}>
                    <img src={commentLikes[i]?.liked ? ChatLikePink : LikeIcon} alt="like" />
                    {commentLikes[i]?.count || 0}
                  </LikeButton>

                  <ReportIconImg src={ReportIcon} alt="report" onClick={openReport} />
                </CommentFooter>
              </CommentContent>
              {c.isMine && <ProfileImg src={BasicProfile} alt="profile" />}
            </CommentBox>
          ))}
          <div ref={commentsEndRef} />
        </CommentSection>

        <CommentInputBox>
          <Input
            placeholder="이야기에 반응해보세요"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddComment()}
          />
          <Arrow onClick={handleAddComment} src={ChatSend} alt="send" />
        </CommentInputBox>
      </Wrapper>

      {isReportOpen && <Report onClose={closeReport} />}
    </>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #fafafa;
  padding-bottom: 70px;
`;

const Header = styled.div`
  background: white;
  font-size: 18px;
  font-weight: bold;
  padding: 15px;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  margin-right: 10px;
  cursor: pointer;
`;

const HeaderTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const PostSection = styled.div`
  background: white;
  margin: 12px;
  padding: 16px;
  border-radius: 12px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.05);
`;

const Info = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
`;

const Nickname = styled.div`
  font-weight: bold;
  font-size: 15px;
`;

const Time = styled.div`
  font-size: 12px;
  color: #999;
`;

const ContentBox = styled.div`
  margin: 12px 0;
  font-size: 15px;
  line-height: 1.5;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
  margin: 12px 0;
`;

const PostImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
`;

const PollBox = styled.div`
  margin: 12px 0;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
`;

const PollOption = styled.div`
  position: relative;
  margin-bottom: 8px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s;

  &:hover {
    transform: translateX(2px);
  }
`;

const PollBar = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${({ $percentage }) => $percentage}%;
  background: linear-gradient(90deg, #fde3fd 0%, #fbbbe5 100%);
  transition: width 0.3s ease;
  z-index: 0;
`;

const PollText = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  font-size: 14px;

  span:first-child {
    font-weight: 500;
  }

  span:last-child {
    color: #666;
    font-size: 13px;
  }
`;

const PollTotal = styled.div`
  text-align: right;
  font-size: 12px;
  color: #888;
  margin-top: 8px;
`;

const Reaction = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #666;
  margin-top: 6px;
`;

const LikeButton = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: ${({ $liked }) => ($liked ? c('brand.pink') : '#666')};

  img {
    width: 18px;
    height: 18px;
  }
`;

const CommentCount = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  img {
    width: 18px;
    height: 18px;
  }
`;

const CommentSection = styled.div`
  padding: 0 12px 80px;
  display: flex;
  flex-direction: column;
`;

const CommentBox = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: 10px;
  justify-content: ${({ $mine }) => ($mine ? 'flex-end' : 'flex-start')};
`;

const CommentContent = styled.div`
  max-width: 75%;
  display: flex;
  flex-direction: column;
  align-items: ${({ $mine }) => ($mine ? 'flex-end' : 'flex-start')};
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const ReportIconImg = styled.img`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const CommentBubble = styled.div`
  background: ${({ $mine }) => ($mine ? '#e6f0ff' : '#f3f3f3')};
  padding: 10px 14px;
  border-radius: 16px;
  margin-top: 4px;
  color: #333;
  font-size: 14px;
  align-self: ${({ $mine }) => ($mine ? 'flex-end' : 'flex-start')};
`;

const CommentFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

const CommentInputBox = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-top: 1px solid #eee;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  background: #f7f7f7;
  padding: 10px 14px;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
`;

const Arrow = styled.img`
  border: none;
  background: none;
  font-size: 20px;
  margin-left: 8px;
  cursor: pointer;
  color: #007aff;
`;
