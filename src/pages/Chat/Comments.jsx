import { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import ChatArrowLeft from '../../assets/icons/ChatArrowLeft.svg';
import ChatSend from '../../assets/icons/ChatSend.svg';
import Report from '../../components/Chat/Report';
import PostDetail from '../../components/Chat/PostDetail';
import CommentList from '../../components/Chat/CommentList';
import { getPostDetail, createPost } from '../../api/Chat/CommentsApi';
import { canWritePost } from '../../utils/guestSession';
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
  const [reportTarget, setReportTarget] = useState(null); // 신고 대상 정보
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

  // 게시글 신고
  const openPostReport = () => {
    setReportTarget({
      targetId: post.id,
      targetType: 'post',
    });
    setIsReportOpen(true);
  };

  // 댓글 신고
  const openCommentReport = commentId => {
    setReportTarget({
      targetId: commentId,
      targetType: 'comment',
      postId: post.id, // 댓글이 속한 게시글 ID
    });
    setIsReportOpen(true);
  };

  const closeReport = () => {
    setIsReportOpen(false);
    setReportTarget(null);
  };

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

  // 댓글 추가 시 createPost 호출하여 서버에 저장하고 댓글 리스트 갱신
  const handleAddComment = async () => {
    if (!canWritePost()) {
      alert('댓글을 작성하려면 로그인이 필요합니다. 로그인해주세요.');
      return;
    }
    if (!newComment.trim()) return;

    const newEntry = {
      nickname: '나',
      text: newComment,
      time: '방금 전',
      isMine: true,
    };

    try {
      // API에 보낼 데이터 형태에 맞게 조정 필요
      const postData = {
        ...post,
        comments: [...comments, newEntry], // 기존 댓글에 새 댓글 추가
      };

      // createPost 호출 (slug, postData 전달)
      const response = await createPost(slug, postData);

      // 응답에 새 댓글 포함되어 있다고 가정하고 상태 갱신
      setComments(response.data.post.comments || []);
      setCommentLikes(prev => [...prev, { liked: false, count: 0 }]);
      setNewComment('');

      // 필요 시 post 상태도 업데이트
      setPost(response.data.post);
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다. 다시 시도해주세요.');
    }
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
          onReport={openPostReport}
        />

        <CommentList
          comments={comments}
          commentLikes={commentLikes}
          onCommentLike={handleCommentLike}
          onReport={openCommentReport}
          onPollVote={handlePollVote}
          pollVotes={pollVotes}
        />

        <CommentInputBox>
          <Input
            placeholder={canWritePost() ? '이야기에 반응해보세요' : '로그인 후 댓글을 작성할 수 있습니다'}
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddComment()}
            disabled={!canWritePost()}
          />
          <Arrow onClick={handleAddComment} src={ChatSend} alt="send" />
        </CommentInputBox>
      </Wrapper>

      {isReportOpen && reportTarget && (
        <Report
          onClose={closeReport}
          targetId={reportTarget.targetId}
          targetType={reportTarget.targetType}
          postId={reportTarget.postId}
        />
      )}
    </>
  );
}
