import apiClient from '../axios';

//투표하기 XX이것도 403
export const votePoll = (slug, pollId, optionId) =>
  apiClient.post(`/${slug}/polls/${pollId}/vote/${optionId}`);
