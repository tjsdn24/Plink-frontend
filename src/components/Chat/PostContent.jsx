import ReportIcon from '../../assets/icons/ChatReport.svg';
import {
  ContentRow,
  ContentBox,
  ReportButton,
  ImagesWrapper,
  PostImage,
  Highlight,
} from './Post.styles';

export default function PostContent({ contentItem, highlightKeyword, onReportClick }) {
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

  if (contentItem.type === 'text')
    return (
      <ContentRow>
        <ContentBox>{highlight(contentItem.data)}</ContentBox>
        <ReportButton src={ReportIcon} alt="report" onClick={onReportClick} />
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
