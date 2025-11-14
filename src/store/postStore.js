import { create } from 'zustand';

export const usePostStore = create((set, get) => ({
  posts: {},

  // 최초 데이터 세팅 (목록/상세에서 불러온 post)
  initPost: (postId, liked, likeCount) => {
    const { posts } = get();
    if (!posts[postId]) {
      set({
        posts: {
          ...posts,
          [postId]: { liked, likeCount },
        },
      });
    }
  },

  // 낙관적 업데이트
  updateLikeOptimistic: (postId, nextLiked) => {
    const { posts } = get();
    const current = posts[postId];

    if (!current) return;

    const nextCount = nextLiked ? current.likeCount + 1 : current.likeCount - 1;

    set({
      posts: {
        ...posts,
        [postId]: {
          liked: nextLiked,
          likeCount: nextCount,
        },
      },
    });
  },

  // 서버가 리턴한 실제 최신값 반영
  syncLikeFromServer: (postId, liked, likeCount) => {
    const { posts } = get();
    set({
      posts: {
        ...posts,
        [postId]: { liked, likeCount },
      },
    });
  },
}));
