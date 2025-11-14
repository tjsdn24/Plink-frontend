import { useNavigate, useParams } from 'react-router-dom';
import { ContentRow, ContentBox, ImagesWrapper, PostImage, Highlight } from './Post.styles';

export default function PostContent({ contentItem, highlightKeyword, post }) {
  const navigate = useNavigate();
  const { slug } = useParams(); // URL에서 slug 자동 추출

  const normalizedKeyword = highlightKeyword.trim().toLowerCase();
  const hasKeyword = normalizedKeyword.length > 0;

  const highlight = text => {
    if (!hasKeyword || typeof text !== 'string') return text;
    const index = text.toLowerCase().indexOf(normalizedKeyword);
    if (index === -1) return text;
    const before = text.slice(0, index);
    const match = text.slice(index, index + normalizedKeyword.length);
    const after = text.slice(index + normalizedKeyword.length);
    return (
      <>
        {before}
        <Highlight>{match}</Highlight>
        {after}
      </>
    );
  };

  const handleCommentClick = () => {
    if (contentItem.type === 'text') {
      if (slug) {
        navigate(`/chat/${slug}/post/${post.id}`, {
          state: { post },
        });
      } else {
        navigate(`/chat/post/${post.id}`, {
          state: { post },
        });
      }
    }
  };

  if (contentItem.type === 'text')
    return (
      <ContentRow onClick={handleCommentClick}>
        <ContentBox>{highlight(contentItem.data)}</ContentBox>
      </ContentRow>
    );

  if (contentItem.type === 'images')
    return (
      <ContentRow>
        <ImagesWrapper>
          {contentItem.data.map((url, i) => (
            <PostImage key={i} src={url} alt={`img-${i}`} />
          ))}
        </ImagesWrapper>
      </ContentRow>
    );

  return null;
}
