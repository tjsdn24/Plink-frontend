import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostItem from './PostItem';
import Report from './Report';
import { ChatWrapper } from './Post.styles';

export default function Post({ postData, highlightKeyword = '' }) {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const navigate = useNavigate();

  // 댓글 클릭 → 상세 페이지 이동
  const handlePostClick = postId => {
    navigate(`/chat/${postId}`, {
      state: { post: postData.find(p => p.id === postId) },
    });
  };

  // ✅ 투표 클릭 시 처리 로직
  const handlePollVote = async (pollData, index) => {
    try {
      console.log('투표 클릭됨:', pollData.options[index]);
      // 🔸 실제 API 연동 시 예:
      // await api.post(`/posts/${pollData.postId}/vote`, { index });
    } catch (error) {
      console.error('투표 반영 실패:', error);
    }
  };

  return (
    <>
      <ChatWrapper>
        {(postData || []).map(post => (
          <PostItem
            key={post.id}
            post={post}
            onCommentClick={() => handlePostClick(post.id)}
            onReportOpen={() => setIsReportOpen(true)}
            highlightKeyword={highlightKeyword}
            onPollVote={handlePollVote}
          />
        ))}
      </ChatWrapper>

      {isReportOpen && <Report onClose={() => setIsReportOpen(false)} />}
    </>
  );
}
