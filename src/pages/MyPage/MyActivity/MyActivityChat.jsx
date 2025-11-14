import { useState, useEffect } from 'react';
import ActivityLayout from '../../../components/MyPage/ActivityLayout';
import { getMyPosts } from '../../../api/mypage';

export default function MyActivityChat() {
  const [stories, setStories] = useState([]);
  const [storyStatus, setStoryStatus] = useState({ loading: false, error: null });

  useEffect(() => {
    const fetchMyPosts = async () => {
      // slug 가져오기
      const slug = localStorage.getItem('userSlug') || 'line4thon';
      
      setStoryStatus({ loading: true, error: null });
      
      try {
        console.log('내가 작성한 글 조회 API 호출:', { slug });
        const myPosts = await getMyPosts({ slug });
        console.log('내가 작성한 글 조회 성공:', myPosts);
        const postsArray = myPosts || [];
        setStories(postsArray);
        // localStorage에 개수 저장
        localStorage.setItem('myStoryCount', String(postsArray.length));
        // 커스텀 이벤트 발생
        window.dispatchEvent(new CustomEvent('activityCountUpdated', { 
          detail: { type: 'story', count: postsArray.length } 
        }));
        setStoryStatus({ loading: false, error: null });
      } catch (error) {
        console.error('내가 작성한 글 조회 실패:', error);
        const errorMessage = error?.message || '작성한 글을 불러오지 못했어요.';
        setStoryStatus({ loading: false, error: errorMessage });
        setStories([]);
        // 에러 시에도 0으로 설정
        localStorage.setItem('myStoryCount', '0');
        window.dispatchEvent(new CustomEvent('activityCountUpdated', { 
          detail: { type: 'story', count: 0 } 
        }));
      }
    };

    fetchMyPosts();
  }, []);

  return (
    <ActivityLayout
      type="story"
      items={stories}
      activeTab="story"
      emptyTitle="아직 작성한 이야기가 없어요."
      emptyDescription="다른 이야기들을 살펴보고 새로운 이야기를 시작해보세요!"
      isLoading={storyStatus.loading}
      errorMessage={storyStatus.error}
    />
  );
}

