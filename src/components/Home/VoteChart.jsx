import styled from 'styled-components';
import { c, f, shadow, typography } from '../../styles/themeUtils';
import CheckIcon from '../../assets/icons/HomeChecked.svg?react';

export default function VoteChart({
  question = '오늘 가장 기대되는 음식은?',
  answers = [
    { id: 1, label: '불고기', percent: 40 },
    { id: 2, label: '피자', percent: 35 },
    { id: 3, label: '초밥', percent: 25 },
  ],
  hasVoted = true,
  myVote = 3,
}) {
  const maxPercent = Math.max(...answers.map(a => a.percent));

  return (
    <Container>
      <Question>{question}</Question>

      {answers.map((ans, idx) => {
        const percentage = hasVoted ? ans.percent : 0;
        const isMyVote = myVote === ans.id;
        const isTop = ans.percent === maxPercent;

        return (
          <AnswerWrapper key={idx}>
            <AnswerBar isTop={isTop}>
              <Fill isTop={isTop} style={{ width: `${percentage}%` }} isMyVote={isMyVote} />
              <Text>
                {ans.label}
                {isMyVote && <CheckIcon />}
              </Text>
              {hasVoted && <Percent isTop={isTop}>{percentage}%</Percent>}
            </AnswerBar>
          </AnswerWrapper>
        );
      })}
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  height: auto;
  border-radius: 12px;
  padding: 12px;
  gap: 12px;
  background-color: ${c('neutral.white')};
  display: flex;
  flex-direction: column;
`;
const Fill = styled.div`
  background: ${({ isTop }) => (isTop ? c('brand.lightPink') : c('neutral.gray'))};
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  border-radius: 8px;
  transition: width 0.3s ease;
  z-index: 0;
`;
const AnswerWrapper = styled.div`
  position: relative;
`;

const Question = styled.h1`
  ${typography('label01')};
`;
const AnswerBar = styled.div`
  box-shadow: ${({ theme }) => theme.shadow.vote};
  height: 48px;
  background: ${c('neutral.bg')};
  border-radius: 12px;
  ${typography('body01')};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  transition: background-color 0.3s ease;
`;
const Text = styled.span`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row;
  gap: 4px;
`;

const Percent = styled.span`
  position: relative;
  z-index: 1;
  ${typography('body02')};
  color: ${c('neutral.gray500')};
`;
