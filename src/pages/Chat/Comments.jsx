import { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import ChatArrowLeft from '../../assets/icons/ChatArrowLeft.svg';
import ChatSend from '../../assets/icons/ChatSend.svg';
import Report from '../../components/Chat/Report';
import PostDetail from '../../components/Chat/PostDetail';
import CommentList from '../../components/Chat/CommentList';
import {
  Wrapper,
  Header,
  BackButton,
  HeaderTitle,
  CommentInputBox,
  Input,
  Arrow,
} from '../../components/Chat//Comments.styles';

export default function Comments() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const initialPost = state?.post || null;

  const params = useParams();
  let rawSlug = params.slug;

  // slug 정제
  let slug = rawSlug;
  if (slug?.startsWith('?')) {
    slug = slug.substring(1);
  }
  if (!slug || slug === 'undefined') {
    slug = 'line4thon';
  }

  const postId = params.postId;


  console.log('post 데이터:', post);
  console.log('post.content:', post?.content);

  const [comments, setComments] = useState(post?.comments || []);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(post?.like || 0);
  const [liked, setLiked] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [pollVotes, setPollVotes] = useState(null);
  const [commentLikes, setCommentLikes] = useState(
    comments.map(() => ({ liked: false, count: 0 }))
  );

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

        <PostDetail
          post={post}
          likes={likes}
          liked={liked}
          commentsCount={comments.length}
          pollVotes={pollVotes}
          onLike={handleLike}
          onPollVote={handlePollVote}
        />

        <CommentList
          comments={comments}
          commentLikes={commentLikes}
          onCommentLike={handleCommentLike}
          onReport={openReport}
        />

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
