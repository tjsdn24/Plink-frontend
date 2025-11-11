//Comments.styles.js

import styled from 'styled-components';
import { c, typography } from '../../styles/themeUtils';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${c('neutral.white')};
  padding-bottom: 70px;
`;

export const Header = styled.div`
  background: ${c('neutral.white')};
  ${typography('headline02')};
  padding: 15px;
  border-bottom: 1px solid ${c('neutral.gray')};
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  margin-right: 10px;
  cursor: pointer;
`;

export const HeaderTitle = styled.div`
  ${typography('headline02')};
`;

export const PostSection = styled.div`
  background: ${c('neutral.white')};
  margin: 12px;
  padding: 16px;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow.md};
`;

export const Info = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ProfileImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Nickname = styled.div`
  ${typography('body01')};
  font-weight: 700;
`;

export const Time = styled.div`
  ${typography('caption01')};
  color: ${c('neutral.gray2')};
`;

export const ContentBox = styled.div`
  margin: 12px 0;
  ${typography('body01')};
  line-height: 1.5;
`;

export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
  margin: 12px 0;
`;

export const PostImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
`;

export const PollBox = styled.div`
  margin: 12px 0;
  padding: 12px;
  background: ${c('neutral.white')};
  // border: 1px solid ${c('neutral.gray')};
  border-radius: 8px;
  box-shadow:
    2px 2px 3px ${c('neutral.bg')},
    -2px 2px 3px ${c('neutral.bg')},
    2px -2px 3px ${c('neutral.bg')},
    -2px -2px 3px ${c('neutral.bg')};
`;

export const PollOption = styled.div`
  position: relative;
  margin-bottom: 8px;
  box-shadow: 2px 2px 5px ${c('neutral.gray')};
  padding: 12px;
  background: ${c('neutral.bg')};
  border-radius: 12px;
  cursor: pointer;
  overflow: hidden;
  transition:
    transform 0.2s,
    border 0.2s,
    background 0.2s;

  border: ${({ $isMax }) =>
    $isMax ? `2px solid ${c('brand.pink')}` : `1px solid ${c('neutral.gray')}`};

  &:hover {
    transform: translateX(2px);
  }
`;

export const PollBar = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${({ $percentage }) => $percentage}%;
  background: ${({ $isMax }) => ($isMax ? c('brand.pink') : c('neutral.gray'))};
  border-radius: 8px;
  transition: width 0.3s ease;
  z-index: 0;
`;

export const PollText = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${typography('body02')};

  span:last-child {
    color: ${c('neutral.black')};
    ${typography('caption01')};
  }
`;

export const PollLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  span {
    color: ${({ $isMax }) => ($isMax ? c('neutral.white') : c('neutral.black'))};
    font-weight: 400; /* ✅ 글씨 두꺼워지는 현상 제거 */
    transition: color 0.2s ease;
  }

  img {
    width: 16px;
    height: 16px;
  }
`;

export const PollTotal = styled.div`
  text-align: left;
  ${typography('caption01')};
  color: ${c('neutral.gray2')};
  margin: 5px 5px 0px 5px;
`;

export const Reaction = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  ${typography('body02')};
  color: ${c('neutral.gray2')};
  margin-top: 6px;
`;

export const LikeButton = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: ${({ $liked }) => ($liked ? c('brand.pink') : c('neutral.gray2'))};

  img {
    width: 18px;
    height: 18px;
  }
`;

export const CommentCount = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  img {
    width: 18px;
    height: 18px;
  }
`;

export const CommentSection = styled.div`
  padding: 0 12px 80px;
  display: flex;
  flex-direction: column;
`;

export const CommentBox = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 10px;
  justify-content: ${({ $mine }) => ($mine ? 'flex-end' : 'flex-start')};
`;

export const CommentContent = styled.div`
  max-width: 75%;
  display: flex;
  flex-direction: column;
  align-items: ${({ $mine }) => ($mine ? 'flex-end' : 'flex-start')};
`;

export const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const ReportIconImg = styled.img`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

export const CommentBubble = styled.div`
  background: ${({ $mine }) => ($mine ? '#e6f0ff' : c('neutral.bg'))};
  box-shadow: 2px 2px 5px ${c('neutral.gray')};
  padding: 10px 14px;
  border-radius: 4px 12px 12px 12px;
  margin-top: 4px;
  color: ${c('neutral.black')};
  ${typography('body02')};
  align-self: ${({ $mine }) => ($mine ? 'flex-end' : 'flex-start')};
`;

export const CommentFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

export const CommentInputBox = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${c('neutral.white')};
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-top: 1px solid ${c('neutral.gray')};
`;

export const Input = styled.input`
  flex: 1;
  border: none;
  background: ${c('neutral.bg')};
  padding: 10px 14px;
  border-radius: 20px;
  ${typography('body02')};
  outline: none;
`;

export const Arrow = styled.img`
  border: none;
  background: none;
  font-size: 20px;
  margin-left: 8px;
  cursor: pointer;
  color: ${c('sub.blue')};
`;
