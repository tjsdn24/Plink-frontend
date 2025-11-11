// PostPollDetail.jsx
import { useState } from 'react';
import ChatPollChecked from '../../assets/icons/ChatPollChecked.svg'; // ✅ 추가
import { PollBox, PollOption, PollBar, PollText, PollTotal, PollLeft } from './Comments.styles';

export default function PostPollDetail({ pollData, pollVotes, onPollVote }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleVote = index => {
    setSelectedIndex(index);
    if (onPollVote) onPollVote(pollData, index);
  };

  const currentVotes = pollVotes || pollData.votes || [];
  const totalVotes = currentVotes.reduce((sum, v) => sum + v, 0);
  const maxVotes = Math.max(...currentVotes, 0);

  return (
    <PollBox>
      {pollData.options.map((option, i) => {
        const votes = currentVotes[i] || 0;
        const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
        const isMax = votes === maxVotes && totalVotes > 0;
        const isMine = selectedIndex === i;

        return (
          <PollOption key={i} $isMax={isMax} $isMine={isMine} onClick={() => handleVote(i)}>
            <PollBar $percentage={percentage} $isMax={isMax} />
            <PollText>
              <PollLeft $isMax={isMax}>
                <span>{option}</span>
                {isMine && <img src={ChatPollChecked} alt="checked" />}
              </PollLeft>
              <span>{percentage.toFixed(0)}%</span>
            </PollText>
          </PollOption>
        );
      })}
      <PollTotal>총 {totalVotes}표</PollTotal>
    </PollBox>
  );
}
