import styled from 'styled-components';
import { c, typography } from '../../styles/themeUtils';

export default function VoteChart({ question, answers, totalVotes }) {
  if (!answers) return null;

  const maxPercent = Math.max(...answers.map(a => a.percent));

  return (
    <Container>
      <Question>{question}</Question>

      {answers.map(ans => {
        const isTop = ans.percent === maxPercent;

        return (
          <AnswerWrapper key={ans.id}>
            <AnswerBar>
              <Fill isTop={isTop} style={{ width: `${ans.percent}%` }} />

              <LeftText>{ans.label}</LeftText>
              <RightText>{ans.percent}%</RightText>
            </AnswerBar>
          </AnswerWrapper>
        );
      })}

      <TotalVotes>총 {totalVotes}명 참여</TotalVotes>
    </Container>
  );
}

/* 스타일 */
const Container = styled.div`
  width: 100%;
  border-radius: 12px;
  padding: 12px;
  background-color: ${c('neutral.white')};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Question = styled.h1`
  ${typography('label01')};
`;

const AnswerWrapper = styled.div`
  position: relative;
`;

const AnswerBar = styled.div`
  position: relative;
  height: 48px;
  background: ${c('neutral.bg')};
  border-radius: 12px;
  ${typography('body01')};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  overflow: hidden;
`;

const Fill = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: 12px;
  background: ${({ isTop }) => (isTop ? c('brand.lightPink') : c('neutral.gray'))};
  transition: width 0.3s ease;
`;

const LeftText = styled.span`
  z-index: 1;
`;

const RightText = styled.span`
  z-index: 1;
  color: ${c('neutral.gray600')};
  ${typography('body02')};
`;

const TotalVotes = styled.div`
  text-align: right;
  margin-top: 8px;
  ${typography('body02')};
  color: ${c('neutral.gray600')};
`;
