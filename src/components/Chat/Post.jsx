import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostItem from './PostItem';
import Report from './Report';
import { ChatWrapper } from './Post.styles';

export default function Post({ postData, highlightKeyword = '' }) {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const navigate = useNavigate();

  const handlePostClick = postId => {
    navigate(`/chat/${postId}`, {
      state: { post: postData.find(p => p.id === postId) },
    });
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
          />
        ))}
      </ChatWrapper>
      {isReportOpen && <Report onClose={() => setIsReportOpen(false)} />}
    </>
  );
}
