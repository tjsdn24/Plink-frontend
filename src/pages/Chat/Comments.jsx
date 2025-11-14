import { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import ChatArrowLeft from '../../assets/icons/ChatArrowLeft.svg';
import ChatSend from '../../assets/icons/ChatSend.svg';
import Report from '../../components/Chat/Report';
import PostDetail from '../../components/Chat/PostDetail';
import CommentList from '../../components/Chat/CommentList';
import { getPostDetail, createPost } from '../../api/Chat/CommentsApi';
import { likePost } from '../../api/Chat/CommentsApi';

import { canWritePost } from '../../utils/guestSession'; // 

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
  const [likes, setLikes] = useState(initialPost?.likeCount || 0);
  const [pollVotes, setPollVotes] = useState(null);
  const [commentLikes, setCommentLikes] = useState(
    initialPost?.comments?.map(() => ({ liked: false, count: 0 })) || []
  );

  // 추가 상태들
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null); // 신고 대상 정보

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
    setLikes(post?.likeCount ?? 0);
    setCommentLikes(post?.comments?.map(() => ({ liked: false, count: 0 })) || []);
  }, [post]);

  useEffect(() => {
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

  // 댓글 추가
  const handleAddComment = async () => {
    if (!canWritePost()) {
      alert('댓글을 작성하려면 로그인이 필요합니다. 로그인해주세요.');
      return;
    }
    if (!newComment.trim()) return;

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append('content', newComment.trim());

      // 댓글 작성 API 호출
      const response = await createComment(slug, postId, formData);
      const newCommentData = response.data;

      // 입력 필드 초기화
      setNewComment('');

      // 새 댓글을 목록에 추가
      if (newCommentData && newCommentData.id) {
        setComments(prev => [...prev, newCommentData]);
        setCommentLikes(prev => [...prev, { 
          liked: false, 
          count: newCommentData.likeCount || 0 
        }]);
        
        // 게시글의 댓글 수 업데이트
        setPost(prev => prev ? { ...prev, commentCount: (prev.commentCount || comments.length) + 1 } : prev);
      } else {
        // 응답에 댓글 데이터가 없으면 게시글 상세 정보 새로고침
        const postResponse = await getPostDetail(slug, postId);
        const updatedPostData = postResponse.data.post || postResponse.data;
        setPost(updatedPostData);
        const updatedComments = updatedPostData.comments || [];
        setComments(updatedComments);
        setCommentLikes(updatedComments.map(comment => ({ 
          liked: false, 
          count: comment.likeCount || 0 
        })));
      }
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      console.error('에러 상세:', error.response?.data);
      alert('댓글 작성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleLike = async () => {
    try {
      setLoading(true);

      await likePost(slug, postId);

      const res = await getPostDetail(slug, postId);

      console.log('detailRes:', res.data);

      setPost(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
          liked={post.liked}
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
