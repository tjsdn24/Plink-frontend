import { useState, useEffect } from 'react';
import ActivityLayout from '../../../components/MyPage/ActivityLayout';
import { getMyLikedPosts } from '../../../api/mypage';

export default function MyActivityLike() {
  const [likes, setLikes] = useState([]);
  const [likeStatus, setLikeStatus] = useState({ loading: false, error: null });

  useEffect(() => {
    const fetchLikedPosts = async () => {
      // slug 가져오기
      const slug = localStorage.getItem('userSlug') || 'line4thon';
      
      setLikeStatus({ loading: true, error: null });
      
      try {
        console.log('좋아요한 게시글 조회 API 호출:', { slug });
        const likedPosts = await getMyLikedPosts({ slug });
        console.log('좋아요한 게시글 조회 성공:', likedPosts);
        const likesArray = likedPosts || [];
        setLikes(likesArray);
        // localStorage에 개수 저장
        localStorage.setItem('myEmpathyCount', String(likesArray.length));
        // 커스텀 이벤트 발생
        window.dispatchEvent(new CustomEvent('activityCountUpdated', { 
          detail: { type: 'empathy', count: likesArray.length } 
        }));
        setLikeStatus({ loading: false, error: null });
      } catch (error) {
        console.error('좋아요한 게시글 조회 실패:', error);
        const errorMessage = error?.message || '공감한 이야기를 불러오지 못했어요.';
        setLikeStatus({ loading: false, error: errorMessage });
        setLikes([]);
        // 에러 시에도 0으로 설정
        localStorage.setItem('myEmpathyCount', '0');
        window.dispatchEvent(new CustomEvent('activityCountUpdated', { 
          detail: { type: 'empathy', count: 0 } 
        }));
      }
    };

    fetchLikedPosts();

    // 좋아요 취소 시 목록에서 제거하는 이벤트 리스너
    const handleRemoveLikedPost = (event) => {
      const { postId } = event.detail;
      setLikes(prevLikes => {
        const filtered = prevLikes.filter(like => {
          const likePostId = like.postId || like.id;
          return likePostId !== postId;
        });
        
        // localStorage와 이벤트 업데이트
        localStorage.setItem('myEmpathyCount', String(filtered.length));
        window.dispatchEvent(new CustomEvent('activityCountUpdated', { 
          detail: { type: 'empathy', count: filtered.length } 
        }));
        
        return filtered;
      });
    };

    window.addEventListener('removeLikedPost', handleRemoveLikedPost);

    return () => {
      window.removeEventListener('removeLikedPost', handleRemoveLikedPost);
    };
  }, []);

  return (
    <ActivityLayout
      type="empathy"
      items={likes}
      activeTab="empathy"
      emptyTitle="공감한 이야기가 아직 없어요."
      emptyDescription="마음에 드는 이야기에 공감을 눌러보세요!"
      isLoading={likeStatus.loading}
      errorMessage={likeStatus.error}
    />
  );
}

