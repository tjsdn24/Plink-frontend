import apiClient from '../axios';

//---게시글 관련---
//일반 게시글 작성하기 XX403떠서 일단 멈춤
export const createPost = (slug, data) => apiClient.post(`/${slug}/posts`, data);

//앙케이스 생성하기
export const createPoll = (slug, data) => apiClient.post(`/${slug}/posts`, data);

//게시글 수정하기
export const updatePost = (slug, postId, data) => apiClient.patch(`/${slug}/posts/${postId}`, data);

//게시글 삭제하기
export const deletePost = (slug, postId) => apiClient.delete(`/${slug}/posts/${postId}`);

//게시글 상세 조회하기 @완료햇는데 나중에 Time 필터링 해야할듯
export const getPostDetail = (slug, postId) => apiClient.get(`/${slug}/posts/${postId}`);

//게시판마다 게시글 조회하기 @일단은 된듯 투표랑 빨간줄 문제 잇음 slug 하드코딩 해결필요
export const getPostsByTag = (slug, tag) => apiClient.get(`/${slug}/posts?tagId=${tag}`);

//게시물에 좋아요 누르기
export const likePost = (slug, postId) => apiClient.post(`/${slug}/posts/${postId}/like`);

//게시글 검색 @완료지만 slug 하드코딩
export const searchPosts = (slug, keyword, tag) => {
  const params = { keyword };
  if (tag) params.tag = tag; // tag가 있을 때만 추가

  return apiClient.get(`/${slug}/posts`, { params });
};

//---게시글 이미지 관련---
//게시물 수정하기 - 이미지 삭제
export const deletePostImage = (slug, imageId) => apiClient.delete(`/${slug}/images/${imageId}`);

//게시글수정하기 - 이미지 추가
export const addPostImage = (slug, postId, data) =>
  apiClient.post(`/${slug}/images/${postId}`, data);

//---댓글 관련---
//댓글 작성하기
export const createComment = (slug, postId, data) =>
  apiClient.post(`/${slug}/posts/${postId}/comments`, data);

//댓글 수정하기
export const updateComment = (slug, commentId, data) =>
  apiClient.patch(`/${slug}/comments/${commentId}`, data);

//댓글 삭제하기
export const deleteComment = (slug, commentId) =>
  apiClient.delete(`/${slug}/comments/${commentId}`);

//---신고 관련---
//게시글 / 댓글 신고하기 XX이것도 로그인 후 확인 필요
export const reportPostOrComment = (slug, data) => apiClient.post(`/${slug}/reports`, data);
