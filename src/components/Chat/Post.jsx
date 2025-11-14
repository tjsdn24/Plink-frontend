import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostItem from './PostItem';
import Report from './Report';
import { ChatWrapper } from './Post.styles';
import { votePoll } from '../../api/Chat/voteApi';

export default function Post({ postData, highlightKeyword = '' }) {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const navigate = useNavigate();
  const { slug } = useParams();

  // 댓글 클릭 → 상세 페이지 이동
  const handlePostClick = postId => {
    navigate(`/${slug}/comments/${postId}`, {
      state: { post: postData.find(p => p.id === postId) },
    });
  };

  // 투표하기
  const handlePollVote = async (pollData, index) => {
    try {
      console.log('=== 투표 시작 ===');
      console.log('slug:', slug);
      console.log('pollData:', pollData);
      console.log('선택한 옵션 index:', index);

      const pollId = pollData.id;
      const option = pollData.options[index];

      // option.id 사용 (optionId)
      const optionId = option.id;

      console.log('pollId:', pollId);
      console.log('optionId:', optionId);

      // API 호출
      const response = await votePoll(slug, pollId, optionId);

      console.log('=== 투표 성공 ===');
      console.log('response:', response.data);

      alert('투표가 완료되었습니다!');
    } catch (error) {
      console.error('=== 투표 실패 ===');
      console.error('error:', error);
      console.error('error.response:', error.response);
      console.error('error.response.data:', error.response?.data);
      alert('투표에 실패했습니다. 다시 시도해주세요.');
      throw error; // PostPollDetail에서 롤백하도록
    }
  };

  // 게시글 신고
  const handleReportOpen = postId => {
    setReportTarget({
      targetId: postId,
      targetType: 'post',
    });
    setIsReportOpen(true);
  };

  const closeReport = () => {
    setIsReportOpen(false);
    setReportTarget(null);
  };

  return (
    <>
      <ChatWrapper>
        {(postData || []).map(post => {
          // 디버깅: 투표 데이터 확인
          if (post.postType === 'POLL' && post.poll) {
            console.log('투표 게시글:', post.id);
            console.log('post.poll.result:', post.poll.result);
          }

          return (
            <PostItem
              key={post.id}
              post={post}
              onCommentClick={() => handlePostClick(post.id)}
              onReportOpen={handleReportOpen}
              highlightKeyword={highlightKeyword}
              onPollVote={handlePollVote}
            />
          );
        })}
      </ChatWrapper>

      {isReportOpen && reportTarget && (
        <Report
          onClose={closeReport}
          targetId={reportTarget.targetId}
          targetType={reportTarget.targetType}
          slug={slug}
        />
      )}
    </>
  );
}
