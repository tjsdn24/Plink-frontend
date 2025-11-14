import { useState, useEffect } from 'react';
import ActivityLayout from '../../../components/MyPage/ActivityLayout';
import { getMyComments } from '../../../api/mypage';

export default function MyActivityComment() {
  const [comments, setComments] = useState([]);
  const [commentStatus, setCommentStatus] = useState({ loading: false, error: null });

  useEffect(() => {
    const fetchComments = async () => {
      // slug 가져오기
      const slug = localStorage.getItem('userSlug') || 'line4thon';
      
      setCommentStatus({ loading: true, error: null });
      
      try {
        console.log('내가 작성한 댓글 조회 API 호출:', { slug });
        const myComments = await getMyComments({ slug });
        console.log('내가 작성한 댓글 조회 성공:', myComments);
        const commentsArray = myComments || [];
        setComments(commentsArray);
        // localStorage에 개수 저장
        localStorage.setItem('myCommentCount', String(commentsArray.length));
        // 커스텀 이벤트 발생
        window.dispatchEvent(new CustomEvent('activityCountUpdated', { 
          detail: { type: 'comment', count: commentsArray.length } 
        }));
        setCommentStatus({ loading: false, error: null });
      } catch (error) {
        console.error('내가 작성한 댓글 조회 실패:', error);
        const errorMessage = error?.message || '댓글을 불러오지 못했어요.';
        setCommentStatus({ loading: false, error: errorMessage });
        setComments([]);
        // 에러 시에도 0으로 설정
        localStorage.setItem('myCommentCount', '0');
        window.dispatchEvent(new CustomEvent('activityCountUpdated', { 
          detail: { type: 'comment', count: 0 } 
        }));
      }
    };

    fetchComments();
  }, []);

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

