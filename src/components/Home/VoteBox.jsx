import TitleBar from './TitleBar';
import { BoxContainer } from './BoxContainer';
import voteIcon from '../../assets/icons/HomeVote.svg';
import VoteChart from './VoteChart';

export default function VoteBox({ popularPoll }) {
  if (!popularPoll || !popularPoll.poll) return null;

  const poll = popularPoll.poll;

  // VoteChart에 맞게 변환
  const answers = poll.result.map(opt => ({
    id: opt.optionId,
    label: opt.content,
    percent: opt.voteRate, // ➜ 0~100
    count: opt.voteCount, // (필요하면 표시 가능)
  }));

  return (
    <BoxContainer>
      <TitleBar
        imageurl={voteIcon}
        title="앙케이트"
        description="다른 사람들의 생각이 궁금하다면?"
      />

      <VoteChart
        question={popularPoll.title}
        answers={answers}
        hasVoted={popularPoll.hasVoted ?? false}
        myVote={popularPoll.myVote ?? null}
        totalVotes={poll.totalVotes}
      />
    </BoxContainer>
  );
}
