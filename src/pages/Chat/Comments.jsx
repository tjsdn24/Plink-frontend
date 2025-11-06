//import { c } from '../../styles/themeUtils';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import LikeIcon from '../../assets/icons/ChatLike.svg';
import CommentIcon from '../../assets/icons/ChatComment.svg';

export default function Comments() {
  const { state } = useLocation();
  const { post } = state || {}; // Post.jsx에서 전달받은 데이터
  const { postId } = useParams();

  if (!post) {
    return <div>게시글 정보를 불러올 수 없습니다. (id: {postId})</div>;
  }

  return (
    <Wrapper>
      <PostSection>
        <Nickname>{post.nickname}</Nickname>
        {post.content.map((item, i) =>
          item.type === 'text' ? (
            <ContentBox key={i}>{item.data}</ContentBox>
          ) : (
            item.type === 'images' && (
              <ImagesWrapper key={i}>
                {item.data.map((img, j) => (
                  <PostImage key={j} src={img} alt="post" />
                ))}
              </ImagesWrapper>
            )
          )
        )}
        <Reaction>
          <img src={LikeIcon} alt="like" />
          {post.like}
          <img src={CommentIcon} alt="comment" />
          {post.comment}
        </Reaction>
      </PostSection>

      <CommentSection>
        {post.comments?.length ? (
          post.comments.map((c, i) => (
            <CommentBox key={i}>
              <strong>{c.nickname}</strong> {c.text}
            </CommentBox>
          ))
        ) : (
          <p>아직 댓글이 없습니다.</p>
        )}
      </CommentSection>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 16px;
  background: #fff;
  min-height: 100vh;
`;

const PostSection = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 12px;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.12),
    0 4px 8px 0 rgba(0, 0, 0, 0.08);
`;

const Nickname = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 8px;
`;

const ContentBox = styled.div`
  background: #f7f7f7;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const ImagesWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`;

const PostImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
`;

const Reaction = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #555;
  font-size: 14px;
  margin-top: 4px;
`;

const CommentSection = styled.div`
  border-top: 1px solid #eee;
  padding-top: 16px;
`;

const CommentBox = styled.div`
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
`;
