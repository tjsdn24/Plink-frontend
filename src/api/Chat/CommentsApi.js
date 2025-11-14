import apiClient from '../axios';

//---게시글 관련---
//일반 게시글 작성하기 @@완료
export const createPost = (slug, data, config = {}) =>
  apiClient.post(`/${slug}/posts`, data, {
    ...config,
  });

//앙케이스 생성하기 @@
export const createPoll = (slug, data) => apiClient.post(`/${slug}/posts`, data);

//게시글 수정하기 @@
export const updatePost = (slug, postId, data) => apiClient.patch(`/${slug}/posts/${postId}`, data);

//게시글 삭제하기 @@
export const deletePost = (slug, postId) => apiClient.delete(`/${slug}/posts/${postId}`);

//게시글 상세 조회하기 (완료 - 시간되면 time 필터링
export const getPostDetail = (slug, postId) => {
  const url = slug ? `/${slug}/posts/${postId}` : `/posts/${postId}`;

  return apiClient.get(url);
};

// 게시판마다 게시글 조회하기 (완료
export const getPostsByTag = (slug, tagId) => {
  const params = {};

  // ✔ tagId가 truthy일 때만 tag 파라미터를 추가
  //   → null, undefined, '', 0 전부 제외 가능
  if (tagId) {
    params.tag = tagId;
  }

  return apiClient.get(`/${slug}/posts`, { params });
};

//게시물에 좋아요 누르기 @@
export const likePost = (slug, postId) => apiClient.post(`/${slug}/posts/${postId}/like`);

//게시글 검색 (완료 - 검색이 되긴 하는데 그냥 검색만 되고 위정렬은 안됨
export const searchPosts = (slug, keyword, tag) => {
  const params = { keyword };

  // ✔ 검색에서도 동일하게 적용
  if (tag) {
    params.tag = tag;
  }

  return apiClient.get(`/${slug}/posts/search`, { params });
};

//---게시글 이미지 관련---
//게시물 수정하기 - 이미지 삭제 @@
export const deletePostImage = (slug, imageId) => apiClient.delete(`/${slug}/images/${imageId}`);

//게시글수정하기 - 이미지 추가 @@
export const addPostImage = (slug, postId, data) =>
  apiClient.post(`/${slug}/images/${postId}`, data);

//---댓글 관련---
//댓글 작성하기 (완료)
export const createComment = (slug, postId, data) =>
  apiClient.post(`/${slug}/posts/${postId}/comments`, data);

//댓글 수정하기 @@
export const updateComment = (slug, commentId, data) =>
  apiClient.patch(`/${slug}/comments/${commentId}`, data);

//댓글 삭제하기 @@
export const deleteComment = (slug, commentId) =>
  apiClient.delete(`/${slug}/comments/${commentId}`);

//---신고 관련---
//게시글 / 댓글 신고하기 @@이것도 로그인 후 확인 필요
export const reportPostOrComment = (slug, data) => apiClient.post(`/${slug}/reports`, data);
