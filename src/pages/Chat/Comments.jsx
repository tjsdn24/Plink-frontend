import { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import ChatArrowLeft from '../../assets/icons/ChatArrowLeft.svg';
import ChatSend from '../../assets/icons/ChatSend.svg';
import Report from '../../components/Chat/Report';
import PostDetail from '../../components/Chat/PostDetail';
import CommentList from '../../components/Chat/CommentList';
import { createComment, getPostDetail } from '../../api/Chat/CommentsApi';
import { canWritePost } from '../../utils/guestSession';
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

  const [post, setPost] = useState(initialPost);
  const [comments, setComments] = useState(initialPost?.comments || []);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(initialPost?.likeCount || initialPost?.like || 0);
  const [liked, setLiked] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [pollVotes, setPollVotes] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentLikes, setCommentLikes] = useState(
    (initialPost?.comments || []).map(() => ({ liked: false, count: 0 }))
  );

  // 게시글 상세 정보 가져오기
  useEffect(() => {
    const fetchPostDetail = async () => {
      if (!postId) return;
      
      try {
        const response = await getPostDetail(slug, postId);
        const postData = response.data;
        setPost(postData);
        const fetchedComments = postData.comments || [];
        setComments(fetchedComments);
        setLikes(postData.likeCount || 0);
        setCommentLikes(fetchedComments.map(comment => ({ 
          liked: false, 
          count: comment.likeCount || 0 
        })));
      } catch (error) {
        console.error('게시글 상세 정보 가져오기 실패:', error);
      }
    };

    if (!initialPost && postId) {
      fetchPostDetail();
    } else if (initialPost) {
      // initialPost가 있을 때도 댓글 좋아요 수 초기화
      const initialComments = initialPost.comments || [];
      setCommentLikes(initialComments.map(comment => ({ 
        liked: false, 
        count: comment.likeCount || 0 
      })));
    }
  }, [postId, slug, initialPost]);

  useEffect(() => {
    if (post?.content && Array.isArray(post.content)) {
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

  const handleAddComment = async () => {
    if (!canWritePost()) {
      alert('댓글을 작성하려면 로그인이 필요합니다. 로그인해주세요.');
      return;
    }
    if (!newComment.trim()) return;
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('content', newComment.trim());

      const commentResponse = await createComment(slug, postId, formData);
      const newCommentData = commentResponse.data;
      
      // 입력 필드 초기화
      setNewComment('');

      // 응답 데이터가 있으면 댓글 목록에 추가
      if (newCommentData && newCommentData.id) {
        // 새 댓글을 목록에 추가
        setComments(prev => [...prev, newCommentData]);
        setCommentLikes(prev => [...prev, { 
          liked: false, 
          count: newCommentData.likeCount || 0 
        }]);
        
        // 게시글의 댓글 수만 업데이트 (게시글 정보는 유지)
        setPost(prev => prev ? { ...prev, commentCount: (prev.commentCount || 0) + 1 } : prev);
      } else {
        // 응답에 댓글 데이터가 없으면 게시글 상세 정보 새로고침
        const postResponse = await getPostDetail(slug, postId);
        const updatedPostData = postResponse.data;
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
    } finally {
      setIsSubmitting(false);
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
            placeholder={canWritePost() ? '이야기에 반응해보세요' : '로그인 후 댓글을 작성할 수 있습니다'}
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddComment()}
            disabled={!canWritePost()}
          />
          <Arrow onClick={handleAddComment} src={ChatSend} alt="send" />
        </CommentInputBox>
      </Wrapper>

      {isReportOpen && <Report onClose={closeReport} />}
    </>
  );
}
