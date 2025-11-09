import { useRef, useEffect } from 'react';
import LikeIcon from '../../assets/icons/ChatLike.svg';
import ChatLikePink from '../../assets/icons/ChatLikePink.svg';
import ReportIcon from '../../assets/icons/ChatReport.svg';
import BasicProfile from '../../assets/icons/ChatBasicProfile.svg';
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
} from './Comments.styles';

export default function CommentList({ comments = [], commentLikes = [], onCommentLike, onReport }) {
  const commentsEndRef = useRef(null);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (comments.length > 0) {
      scrollToBottom();
    }
  }, [comments]);

  return (
    <CommentSection>
      {comments.map((c, i) => (
        <CommentBox key={i} $mine={c.isMine}>
          {!c.isMine && <ProfileImg src={BasicProfile} alt="profile" />}
          <CommentContent $mine={c.isMine}>
            <CommentHeader>
              <strong>{c.nickname}</strong>
            </CommentHeader>
            <CommentBubble $mine={c.isMine}>{c.text}</CommentBubble>
            <CommentFooter>
              <LikeButton onClick={() => onCommentLike(i)} $liked={commentLikes[i]?.liked}>
                <img src={commentLikes[i]?.liked ? ChatLikePink : LikeIcon} alt="like" />
                {commentLikes[i]?.count || 0}
              </LikeButton>
              <ReportIconImg src={ReportIcon} alt="report" onClick={onReport} />
            </CommentFooter>
          </CommentContent>
          {c.isMine && <ProfileImg src={BasicProfile} alt="profile" />}
        </CommentBox>
      ))}
      <div ref={commentsEndRef} />
    </CommentSection>
  );
}
