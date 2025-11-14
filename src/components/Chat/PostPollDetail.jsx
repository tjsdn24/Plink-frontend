import { useState, useEffect } from 'react';
import ChatPollChecked from '../../assets/icons/ChatPollChecked.svg';
import { PollBox, PollOption, PollBar, PollText, PollTotal, PollLeft } from './Comments.styles';

export default function PostPollDetail({ pollData, pollVotes = [], onPollVote }) {
  if (!pollData || !Array.isArray(pollData.options)) {
    return <div>투표 데이터가 없습니다.</div>;
  }

  const [localVotes, setLocalVotes] = useState(() => {
    if (Array.isArray(pollVotes) && pollVotes.length > 0) return pollVotes;
    if (Array.isArray(pollData.votes)) return pollData.votes;
    return new Array(pollData.options.length).fill(0);
  });

  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    if (Array.isArray(pollVotes) && pollVotes.length > 0) {
      setLocalVotes(pollVotes);
    }
  }, [pollVotes]);

  const handleVote = async optionId => {
    const index = pollData.options.findIndex(opt => opt.id === optionId);
    if (index === -1) return;

    const originalVotes = [...localVotes];
    const updatedVotes = [...localVotes];

    updatedVotes[index] = (updatedVotes[index] || 0) + 1;
    setLocalVotes(updatedVotes);
    setSelectedIndex(index);

    try {
      await onPollVote(pollData.id, optionId);
    } catch (e) {
      console.error(e);

      // 실패 시 롤백
      setLocalVotes(originalVotes);
      setSelectedIndex(null);
    }
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
          <PollOption key={option.id} $isMax={isMax} onClick={() => handleVote(option.id)}>
            <PollBar $percentage={percentage} $isMax={isMax} />
            <PollText>
              <PollLeft $isMax={isMax}>
                <span>{option.text}</span>
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
