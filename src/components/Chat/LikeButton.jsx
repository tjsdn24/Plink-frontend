import { useState } from 'react';
import { usePostStore } from '../../store/postStore';
import LikeIcon from '../../assets/icons/ChatLike.svg';
import ChatLikePink from '../../assets/icons/ChatLikePink.svg';
import { likePost } from '../../api/Chat/CommentsApi';

export default function LikeButton({ postId, slug }) {
  const { posts, updateLikeOptimistic, syncLikeFromServer } = usePostStore();
  const [loading, setLoading] = useState(false);

  // postId 없으면 렌더 중단
  if (!postId) {
    console.warn('LikeButton: postId가 없습니다.', { postId, slug });
    return null;
  }

  // 초기값 없으면 기본값
  const post = posts[postId] ?? { liked: false, likeCount: 0 };

  const liked = Boolean(post.liked);
  const likeCount = Number(post.likeCount);

  const handleClick = async () => {
    if (loading) return;

    const nextLiked = !liked;

    // optimistic update
    updateLikeOptimistic(postId, nextLiked);

    try {
      setLoading(true);

      if (!slug) {
        console.warn('LikeButton: slug가 없습니다. 서버 요청을 생략합니다.');
        setLoading(false);
        return;
      }

      const res = await likePost(slug, postId);

      if (res?.data) {
        syncLikeFromServer(postId, res.data.liked, res.data.likeCount);
      }
    } catch (err) {
      console.error('좋아요 처리 실패:', err);
      updateLikeOptimistic(postId, liked); // 롤백
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        cursor: loading ? 'default' : 'pointer',
      }}
    >
      <img src={liked ? ChatLikePink : LikeIcon} width={18} height={18} alt="like" />
      <span>{likeCount}</span>
    </div>
  );
}
