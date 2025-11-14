// src/components/Chat/LikeButton.jsx
import { useEffect, useState } from 'react';
import LikeIcon from '../../assets/icons/ChatLike.svg';
import ChatLikePink from '../../assets/icons/ChatLikePink.svg';

export default function LikeButton({
  liked: initialLiked,
  count: initialCount,
  onToggle,
  disabled,
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  // 바깥에서 post가 갱신되면 내부 상태도 맞춰주기
  useEffect(() => {
    setLiked(initialLiked);
    setCount(initialCount);
  }, [initialLiked, initialCount]);

  const handleClick = async () => {
    if (loading || disabled) return;

    const nextLiked = !liked;

    // optimistic 업데이트
    setLiked(nextLiked);
    setCount(prev => (nextLiked ? prev + 1 : prev - 1));

    try {
      setLoading(true);
      if (onToggle) {
        await onToggle(nextLiked);
      }
    } catch (err) {
      console.error('좋아요 처리 실패:', err);
      // 롤백
      setLiked(!nextLiked);
      setCount(prev => (nextLiked ? prev - 1 : prev + 1));
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
        cursor: disabled || loading ? 'default' : 'pointer',
      }}
    >
      <img src={liked ? ChatLikePink : LikeIcon} alt="like" width={18} height={18} />
      <span>{count}</span>
    </div>
  );
}
