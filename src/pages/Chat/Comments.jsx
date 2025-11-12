import { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import ChatArrowLeft from '../../assets/icons/ChatArrowLeft.svg';
import ChatSend from '../../assets/icons/ChatSend.svg';
import Report from '../../components/Chat/Report';
import PostDetail from '../../components/Chat/PostDetail';
import CommentList from '../../components/Chat/CommentList';
import { getPostDetail } from '../../api/Chat/CommentsApi';
import {
  Wrapper,
  Header,
  BackButton,
  HeaderTitle,
  CommentInputBox,
  Input,
  Arrow,
} from '../../components/Chat/Comments.styles';

export default function Comments() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const initialPost = state?.post || null;
  const { slug, postId } = useParams();

  const [post, setPost] = useState(initialPost);
  const [loading, setLoading] = useState(!initialPost);

  // 댓글, 좋아요, 투표 상태
  const [comments, setComments] = useState(initialPost?.comments || []);
  const [likes, setLikes] = useState(initialPost?.like || 0);
  const [pollVotes, setPollVotes] = useState(null);
  const [commentLikes, setCommentLikes] = useState(
    initialPost?.comments?.map(() => ({ liked: false, count: 0 })) || []
  );

  // 추가 상태들
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (!initialPost) {
      const fetchPostDetail = async () => {
        try {
          setLoading(true);
          const res = await getPostDetail(slug, postId);
          console.log('받아온 데이터:', res.data.post);
          setPost(res.data.post);
        } catch (error) {
          console.error('게시글 상세 조회 실패:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchPostDetail();
    }
  }, [slug, postId, initialPost]);

  useEffect(() => {
    console.log('post 상태 변경:', post);
    setComments(post?.comments || []);
    setLikes(post?.like || 0);
    setCommentLikes(post?.comments?.map(() => ({ liked: false, count: 0 })) || []);
  }, [post]);

  // post가 바뀔 때마다 댓글, 좋아요 등 상태 초기화
  useEffect(() => {
    setComments(post?.comments || []);
    setLikes(post?.like || 0);
    setCommentLikes(post?.comments?.map(() => ({ liked: false, count: 0 })) || []);

    if (Array.isArray(post?.content)) {
      const pollItem = post.content.find(item => item.type === 'poll');
      setPollVotes(pollItem?.data?.votes || []);
    } else {
      setPollVotes(null);
    }
  }, [post]);

  if (loading) return <div>로딩 중...</div>;
  if (!post) return <div>게시글 정보를 불러올 수 없습니다.</div>;

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

  const handleEditPost = postId => {
    navigate(`/${slug}/comments/${postId}/edit`, { state: { post } });
  };

  const handleDeletePost = postId => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      console.log('삭제된 게시글 ID:', postId);
      alert('게시글이 삭제되었습니다.');
      navigate(-1);
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

        <PostDetail
          post={post}
          likes={likes}
          liked={liked}
          commentsCount={comments.length}
          pollVotes={pollVotes}
          onLike={handleLike}
          onPollVote={handlePollVote}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
        />

        <CommentList
          comments={comments}
          commentLikes={commentLikes}
          onCommentLike={handleCommentLike}
          onReport={openReport}
          onPollVote={handlePollVote}
          pollVotes={pollVotes}
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
