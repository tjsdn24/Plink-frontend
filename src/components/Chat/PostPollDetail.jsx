import { useState, useEffect } from 'react';
import ChatPollChecked from '../../assets/icons/ChatPollChecked.svg';
import { PollBox, PollOption, PollBar, PollText, PollTotal, PollLeft } from './Comments.styles';

export default function PostPollDetail({ pollData, pollVotes = [], onPollVote }) {
  const [localVotes, setLocalVotes] = useState(pollVotes.length ? pollVotes : pollData.votes || []);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    if (pollVotes.length) setLocalVotes(pollVotes);
  }, [pollVotes]);

  const handleVote = index => {
    const updatedVotes = [...localVotes];
    updatedVotes[index] = (updatedVotes[index] || 0) + 1;
    setLocalVotes(updatedVotes);
    setSelectedIndex(index);
    if (onPollVote) onPollVote(pollData, index);
  };

  const totalVotes = localVotes.reduce((sum, v) => sum + v, 0);
  const maxVotes = Math.max(...localVotes, 0);

  return (
    <PollBox>
      {pollData.options.map((option, i) => {
        const votes = localVotes[i] || 0;
        const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
        const isMax = votes === maxVotes && totalVotes > 0;
        const isMine = selectedIndex === i;

        return (
          <PollOption key={i} $isMax={isMax} onClick={() => handleVote(i)}>
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
