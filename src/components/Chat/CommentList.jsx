import { useRef, useEffect } from 'react';
import LikeIcon from '../../assets/icons/ChatLike.svg';
import ChatLikePink from '../../assets/icons/ChatLikePink.svg';
import ReportIcon from '../../assets/icons/ChatReport.svg';
import BasicProfile from '../../assets/icons/ChatBasicProfile.svg';
import PostPollDetail from './PostPollDetail';
import {
  CommentSection,
  CommentBox,
  ProfileImg,
  CommentContent,
  CommentHeader,
  CommentBubble,
  CommentFooter,
  LikeButton,
  ReportIconImg,
  Time,
} from './Comments.styles';

export default function CommentList({
  comments = [],
  commentLikes = [],
  onCommentLike,
  onReport,
  onPollVote,
  pollVotes,
}) {
  const commentsEndRef = useRef(null);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (comments.length > 0) {
      scrollToBottom();
    }
  }, [comments]);

  const handleReport = commentId => {
    if (onReport) {
      onReport(commentId);
    }
  };

  // 시간 포맷팅 함수
  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return '방금 전';
      if (minutes < 60) return `${minutes}분 전`;
      if (hours < 24) return `${hours}시간 전`;
      if (days < 7) return `${days}일 전`;
      return date.toLocaleDateString('ko-KR');
    } catch {
      return dateString;
    }
  };

  return (
    <CommentSection>
      {comments.map((c, i) => {
        // API 응답 형식과 기존 형식 모두 지원
        const nickname = c.author || c.nickname || '익명';
        const content = c.content || c.text || '';
        const profileImage = c.profileImageUrl || BasicProfile;
        const time = c.time2 || formatTime(c.createdAt) || c.time || '';
        const isMine = c.isMine !== undefined ? c.isMine : false;

        return (
          <CommentBox key={c.id || i} $mine={isMine}>
            {!isMine && <ProfileImg src={profileImage} alt="profile" />}
            <CommentContent $mine={isMine}>
              <CommentHeader>
                <strong>{nickname}</strong>
              </CommentHeader>
              {c.type !== 'poll' && <CommentBubble $mine={isMine}>{content}</CommentBubble>}
              {c.type === 'poll' && (
                <PostPollDetail
                  pollData={c.pollData}
                  pollVotes={pollVotes || c.pollVotes}
                  onPollVote={(pollData, index) => {
                    if (onPollVote) onPollVote(pollData, index);
                  }}
                />
              )}

              <CommentFooter>
                <LikeButton onClick={() => onCommentLike(i)} $liked={commentLikes[i]?.liked}>
                  <img src={commentLikes[i]?.liked ? ChatLikePink : LikeIcon} alt="like" />
                  {commentLikes[i]?.count || c.likeCount || 0}
                </LikeButton>
                <ReportIconImg src={ReportIcon} alt="report" onClick={() => handleReport(c.id)} />
                <Time>{time}</Time>
              </CommentFooter>
            </CommentContent>
            {isMine && <ProfileImg src={profileImage} alt="profile" />}
          </CommentBox>
        );
      })}
      <div ref={commentsEndRef} />
    </CommentSection>
  );
}
