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
  ${typography('headline01')};
  color: ${c('brand.pink')};
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
  display: block;
  font-size: 12px;
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
    2px 2px 5px ${c('neutral.bg')},
    -2px 2px 5px ${c('neutral.bg')},
    2px -2px 5px ${c('neutral.bg')},
    -2px -2px 5px ${c('neutral.bg')};
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
    font-weight: 500;
    transition: color 0.2s ease;
  }

  img {
    width: 16px;
    height: 16px;
    filter: ${({ $isMax }) => ($isMax ? 'brightness(0) invert(1)' : 'none')};
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
  box-shadow: 2px 2px 10px ${c('neutral.gray')};
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

  &:disabled {
    background: ${c('neutral.gray')};
    color: ${c('neutral.gray2')};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const Arrow = styled.img`
  border: none;
  background: none;
  font-size: 20px;
  margin-left: 8px;
  cursor: pointer;
  color: ${c('sub.blue')};
`;

export const DotButton = styled.img`
  width: 20px;
  height: 20px;
  background: none;
  cursor: pointer;
`;

export const DotMenuWrapper = styled.div`
  position: relative;
`;

export const MenuBox = styled.div`
  position: absolute;
  top: 28px;
  right: 0;
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
`;

export const MenuItem = styled.div`
  padding: 10px 14px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  width: 60px;

  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #f8f8f8;
  }
`;
