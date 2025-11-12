import apiClient from '../axios';

//투표하기
export const votePoll = (slug, pollId, optionId) =>
  apiClient.post(`/${slug}/polls/${pollId}/vote/${optionId}`);
