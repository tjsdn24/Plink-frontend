import { useNavigate, useParams } from 'react-router-dom';
import { ContentRow, ContentBox, ImagesWrapper, PostImage, Highlight } from './Post.styles';

export default function PostContent({ contentItem, highlightKeyword, post }) {
  const navigate = useNavigate();
  const { slug } = useParams();

  const normalizedKeyword = highlightKeyword?.trim().toLowerCase() || '';
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

  const navigateDetail = () => {
    if (!post?.id) return;
    if (slug) {
      navigate(`/chat/${slug}/post/${post.id}`, { state: { post } });
    } else {
      navigate(`/chat/post/${post.id}`, { state: { post } });
    }
  };

  /* -------------------------------------------------------
      1) contentItem 방식 (목록에서 사용)
  ------------------------------------------------------- */
  if (contentItem && contentItem.type === 'text') {
    return (
      <ContentRow onClick={navigateDetail}>
        <ContentBox>{highlight(contentItem.data)}</ContentBox>
      </ContentRow>
    );
  }

  if (contentItem && contentItem.type === 'images') {
    return (
      <ContentRow>
        <ImagesWrapper>
          {contentItem.data.map((url, i) => (
            <PostImage key={i} src={url} alt={`img-${i}`} />
          ))}
        </ImagesWrapper>
      </ContentRow>
    );
  }

  /* -------------------------------------------------------
      2) contentItem 없는 경우 → 배열 기반 content 처리
         (PostDetail 내부 content 구조 대응)
  ------------------------------------------------------- */
  if (Array.isArray(post?.content)) {
    return (
      <>
        {post.content.map((item, index) => {
          if (item.type === 'text') {
            return (
              <ContentRow key={index} onClick={navigateDetail}>
                <ContentBox>{highlight(item.data)}</ContentBox>
              </ContentRow>
            );
          }

          if (item.type === 'images') {
            return (
              <ContentRow key={index}>
                <ImagesWrapper>
                  {item.data.map((url, i) => (
                    <PostImage key={i} src={url} alt={`img-${i}`} />
                  ))}
                </ImagesWrapper>
              </ContentRow>
            );
          }

          return null;
        })}
      </>
    );
  }

  /* -------------------------------------------------------
      3) content 자체가 그냥 문자열일 경우
         (일부 목록/상세 API에서 이런 경우 있음)
  ------------------------------------------------------- */
  if (typeof post?.content === 'string') {
    return (
      <ContentRow onClick={navigateDetail}>
        <ContentBox>{highlight(post.content)}</ContentBox>
      </ContentRow>
    );
  }

  return null;
}
