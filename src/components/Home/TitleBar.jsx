import styled from 'styled-components';
import homearrow from '../../assets/icons/HomeArrow.svg';
import { c, s, typography } from '../../styles/themeUtils';

const TitleBarContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const TopWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
  align-items: center;
`;

const TitleText = styled.span`
  ${typography('headline02')};
`;
const ArrowWrapper = styled.button`
  color: ${c('neutral.black')};
  ${typography('caption01')};
  display: flex;
  flex-direction: row;
  gap: 3px;
  align-items: center;
`;
const TitleDescription = styled.span`
  ${typography('body01')};
`;
export default function TitleBar({
  title = '제목',
  imageurl,
  description = '설명',
  onClick,
  showArrow = false,
}) {
  return (
    <TitleBarContainer>
      <TopWrapper>
        <TitleWrapper>
          <img src={imageurl} alt="이미지" />
          <TitleText>{title}</TitleText>
        </TitleWrapper>
        {showArrow && (
          <ArrowWrapper onClick={onClick}>
            전체보기
            <img src={homearrow} alt="화살표 아이콘" />
          </ArrowWrapper>
        )}
      </TopWrapper>
      <TitleDescription>{description}</TitleDescription>
    </TitleBarContainer>
  );
}
