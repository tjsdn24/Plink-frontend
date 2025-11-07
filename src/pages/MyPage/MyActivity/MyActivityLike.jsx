import ActivityLayout from '../../../components/MyPage/ActivityLayout';
import { useActivityData } from '../../../components/MyPage/useActivityData';

export default function MyActivityLike() {
  const { likes } = useActivityData();

  return (
    <ActivityLayout
      type="empathy"
      items={likes}
      activeTab="empathy"
      emptyTitle="공감한 이야기가 아직 없어요."
      emptyDescription="마음에 드는 이야기에 공감을 눌러보세요!"
    />
  );
}

