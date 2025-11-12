import apiClient from '../axios';

//게시글 / 댓글 신고하기
export const reportPostOrComment = (slug, data) => apiClient.post(`/${slug}/reports`, data);
