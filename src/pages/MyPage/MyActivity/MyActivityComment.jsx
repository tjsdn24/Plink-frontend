import ActivityLayout from '../../../components/MyPage/ActivityLayout';
import { useActivityData } from '../../../components/MyPage/useActivityData';

export default function MyActivityComment() {
  const { comments, commentStatus } = useActivityData();

  return (
    <ActivityLayout
      type="comment"
      items={comments}
      activeTab="comment"
      emptyTitle="댓글을 남긴 기록이 없어요."
      emptyDescription="관심 있는 이야기에 댓글을 남겨보세요!"
      isLoading={commentStatus.loading}
      errorMessage={commentStatus.error}
    />
  );
}

