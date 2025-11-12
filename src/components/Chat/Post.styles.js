import styled from 'styled-components';
import { c, typography } from '../../styles/themeUtils';

export const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const PostWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid ${c('neutral.gray')};
`;

export const ProfileImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

export const PostBox = styled.div`
  flex: 1;
`;

export const Nickname = styled.div`
  ${typography('body02')};
  font-weight: 700;
  color: ${c('neutral.black')};
  margin-bottom: 6px;
`;

export const ContentAndEtcWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
`;

export const ContentRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ContentBox = styled.div`
  ${typography('body02')};
  color: ${c('neutral.black')};
  background-color: ${c('neutral.bg')};
  box-shadow: 2px 2px 10px ${c('neutral.gray')};
  padding: 10px;
  border-radius: 4px 12px 12px 12px;
  line-height: 1.5;
  word-break: break-word;
`;

export const Highlight = styled.span`
  background-color: ${c('sub.yellow')};
`;

export const ReportButton = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

export const ImagesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const PostImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
`;

export const Etc = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const Like = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: default;
  cursor: pointer;
`;

export const Comment = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`;

export const ReactionIcon = styled.img`
  width: 18px;
  height: 18px;
`;

export const Time = styled.div`
  ${typography('caption01')};
  color: ${c('neutral.gray2')};
`;
