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
        setStories(myPosts || []);
        setStoryStatus({ loading: false, error: null });
      } catch (error) {
        console.error('내가 작성한 글 조회 실패:', error);
        const errorMessage = error?.message || '작성한 글을 불러오지 못했어요.';
        setStoryStatus({ loading: false, error: errorMessage });
        setStories([]);
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

