import { PollBox, PollOption, PollBar, PollText, PollTotal } from './Post.styles';

export default function PostPoll({ data }) {
  const totalVotes = data.votes.reduce((a, b) => a + b, 0);

  return (
    <PollBox>
      {data.options.map((option, i) => {
        const percent = totalVotes ? (data.votes[i] / totalVotes) * 100 : 0;
        return (
          <PollOption key={i}>
            <PollBar $percentage={percent} />
            <PollText>
              <span>{option}</span>
              <span>
                {data.votes[i]}표 ({percent.toFixed(0)}%)
              </span>
            </PollText>
          </PollOption>
        );
      })}
      <PollTotal>총 {totalVotes}표</PollTotal>
    </PollBox>
  );
}
