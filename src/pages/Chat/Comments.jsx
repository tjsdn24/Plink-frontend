import { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import ChatArrowLeft from '../../assets/icons/ChatArrowLeft.svg';
import ChatSend from '../../assets/icons/ChatSend.svg';
import Report from '../../components/Chat/Report';
import PostDetail from '../../components/Chat/PostDetail';
import CommentList from '../../components/Chat/CommentList';
import { getPostDetail, createComment } from '../../api/Chat/CommentsApi';
import { likePost } from '../../api/Chat/CommentsApi';

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

  const [comments, setComments] = useState(initialPost?.comments || []);
  const [likes, setLikes] = useState(initialPost?.likeCount || 0);
  const [pollVotes, setPollVotes] = useState(null);
  const [commentLikes, setCommentLikes] = useState(
    initialPost?.comments?.map(() => ({ liked: false, count: 0 })) || []
  );

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);

  const [newComment, setNewComment] = useState('');

  /* ---------------------------------------------
     ⭐ 댓글 변환 함수 (API 스펙 기반으로 전면 수정)
     --------------------------------------------- */
  const transformComment = comment => {
    if (!comment) return null;

    const formatTime = dateString => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;

      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return '방금 전';
      if (minutes < 60) return `${minutes}분 전`;
      if (hours < 24) return `${hours}시간 전`;
      if (days < 7) return `${days}일 전`;

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      const ampm = date.getHours() < 12 ? '오전' : '오후';
      const displayHour = date.getHours() % 12 || 12;

      return `${year}. ${month}. ${day}. ${ampm} ${displayHour}:${minute}:${String(
        date.getSeconds()
      ).padStart(2, '0')}`;
    };

    return {
      id: comment.id,
      text: comment.content ?? '',
      nickname: comment.author ?? '익명', // API: author = string
      profileImage: comment.profileImageUrl ?? null,
      time2: formatTime(comment.createdAt),
      isMine: false, // API에서 userId 제공 없음
      type: 'normal',
      likeCount: comment.likeCount ?? 0,
      pollData: null,
      pollVotes: null,
    };
  };

  const transformComments = commentsArray => {
    if (!Array.isArray(commentsArray)) return [];

    // 🔥 createdAt 기준 최신이 아래로 가도록 정렬 (오래된 → 최신)
    const sorted = [...commentsArray].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return sorted.map(transformComment).filter(Boolean);
  };

  /* ---------------------------------------------
     게시글 상세 조회
     --------------------------------------------- */
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        const res = await getPostDetail(slug, postId);
        setPost(res.data);
      } catch (error) {
        console.error('게시글 상세 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPostDetail();
  }, [slug, postId, initialPost]);

  /* ---------------------------------------------
     post 변경 시 댓글/좋아요 업데이트
     --------------------------------------------- */
  useEffect(() => {
    console.log('post 상태 변경:', post);

    const transformedComments = transformComments(post?.comments || []);

    setComments(transformedComments);
    setLikes(post?.likeCount ?? 0);

    setCommentLikes(
      transformedComments.map(comment => ({
        liked: false,
        count: comment.likeCount || 0,
      }))
    );
  }, [post]);

  /* ---------------------------------------------
     poll 데이터 처리
     --------------------------------------------- */
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

  const openPostReport = () => {
    setReportTarget({
      targetId: post.id,
      targetType: 'post',
    });
    setIsReportOpen(true);
  };

  const openCommentReport = commentId => {
    setReportTarget({
      targetId: commentId,
      targetType: 'comment',
      postId: post.id,
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

  /* ---------------------------------------------
     댓글 추가
     --------------------------------------------- */
  const handleAddComment = async () => {
    if (!canWritePost()) {
      alert('댓글을 작성하려면 로그인이 필요합니다. 로그인해주세요.');
      return;
    }
    if (!newComment.trim()) return;

    try {
      const formData = new FormData();
      formData.append('content', newComment.trim());

      const response = await createComment(slug, postId, formData);
      const newCommentData = response.data;

      setNewComment('');

      if (newCommentData && newCommentData.id) {
        const transformedNewComment = transformComment(newCommentData);

        setComments(prev => [...prev, transformedNewComment]);
        setCommentLikes(prev => [
          ...prev,
          { liked: false, count: transformedNewComment.likeCount || 0 },
        ]);

        setPost(prev =>
          prev ? { ...prev, commentCount: (prev.commentCount || comments.length) + 1 } : prev
        );
      } else {
        const postResponse = await getPostDetail(slug, postId);
        setPost(postResponse.data);
      }
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  /* ---------------------------------------------
     좋아요
     --------------------------------------------- */
  const handleLike = async () => {
    try {
      setLoading(true);

      await likePost(slug, postId);
      const res = await getPostDetail(slug, postId);

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
          slug={slug}
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
            placeholder={
              canWritePost() ? '이야기에 반응해보세요' : '로그인 후 댓글을 작성할 수 있습니다'
            }
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
