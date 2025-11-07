import ActivityLayout from '../../../components/MyPage/ActivityLayout';
import { useActivityData } from '../../../components/MyPage/useActivityData';

export default function MyActivityChat() {
  const { stories } = useActivityData();

  return (
    <ActivityLayout
      type="story"
      items={stories}
      activeTab="story"
      emptyTitle="아직 작성한 이야기가 없어요."
      emptyDescription="다른 이야기들을 살펴보고 새로운 이야기를 시작해보세요!"
    />
  );
}

