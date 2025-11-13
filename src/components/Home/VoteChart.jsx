import styled from 'styled-components';
import { c, typography } from '../../styles/themeUtils';
import CheckIcon from '../../assets/icons/HomeChecked.svg?react';

export default function VoteChart({ question, answers, hasVoted, myVote, totalVotes }) {
  if (!answers) return null;

  const maxPercent = Math.max(...answers.map(a => a.percent));

  return (
    <Container>
      <Question>{question}</Question>

      {answers.map(ans => {
        const isMyVote = myVote === ans.id;
        const isTop = ans.percent === maxPercent;

        return (
          <AnswerWrapper key={ans.id}>
            <AnswerBar isTop={isTop}>
              <Fill isTop={isTop} style={{ width: `${hasVoted ? ans.percent : 0}%` }} />

              <Text>
                {ans.label}
                {isMyVote && <CheckIcon />}
              </Text>

              {hasVoted && <Percent>{ans.percent}%</Percent>}
            </AnswerBar>
          </AnswerWrapper>
        );
      })}

      {hasVoted && <TotalVotes>총 {totalVotes}명 참여</TotalVotes>}
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
  height: 48px;
  background: ${c('neutral.bg')};
  border-radius: 12px;
  ${typography('body01')};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  position: relative;
`;

const Fill = styled.div`
  background: ${({ isTop }) => (isTop ? c('brand.lightPink') : c('neutral.gray'))};
  position: absolute;
  inset: 0;
  border-radius: 12px;
  transition: width 0.3s ease;
  z-index: 0;
`;

const Text = styled.span`
  position: relative;
  z-index: 1;
  display: flex;
  gap: 4px;
`;

const Percent = styled.span`
  position: relative;
  z-index: 1;
  ${typography('body02')};
  color: ${c('neutral.gray500')};
`;

const TotalVotes = styled.div`
  ${typography('body02')};
  color: ${c('neutral.gray600')};
  margin-top: 8px;
  text-align: right;
`;
