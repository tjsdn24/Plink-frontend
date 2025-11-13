import { useMemo } from 'react';
import { sanitizeNickname, loadPostsFromStorage, getPostPreview, ensurePostIds } from './activityUtils';

const getStoredValue = key => {
  try {
    const stored = localStorage.getItem(key);
    return stored;
  } catch {
    return null;
  }
};

const getStoredArray = key => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export function useActivityData() {
  const fallbackPosts = useMemo(() => ensurePostIds(loadPostsFromStorage()), []);

  const nickname = useMemo(() => {
    const stored = getStoredValue('nickname');
    if (!stored) return null;
    return sanitizeNickname(stored);
  }, []);

  const likedPostIds = useMemo(() => {
    return getStoredArray('userLikedPostIds');
  }, []);

  const commentedPostIds = useMemo(() => {
    return getStoredArray('userCommentedPostIds');
  }, []);

  const {
    postsByUser,
    fallbackStories,
    empathyPosts,
    fallbackComments,
  } = useMemo(() => {
    const likedSet = new Set(likedPostIds.map(String));
    const commentedSet = new Set(commentedPostIds.map(String));

    const normalizedNickname = nickname;
    const fallbackNickname = '익명의 사용자';

    const postsByUserResult = normalizedNickname
      ? fallbackPosts.filter(post => sanitizeNickname(post.nickname) === normalizedNickname)
      : [];

    const fallbackStoriesResult = fallbackPosts.filter(
      post => sanitizeNickname(post.nickname) === fallbackNickname
    );

    const empathyPostsResult = fallbackPosts.filter(post => likedSet.has(String(post.id)));

    const candidateNicknames = new Set();
    if (normalizedNickname) candidateNicknames.add(normalizedNickname);
    candidateNicknames.add(fallbackNickname);

    const allCommentEntries = fallbackPosts.flatMap(post => {
      if (!Array.isArray(post.comments)) return [];
      return post.comments
        .map((comment, index) => {
          const sanitized = sanitizeNickname(comment.nickname);
          return {
            id: `${post.id}-${index}`,
            postId: post.id,
            postNickname: post.nickname,
            postPreview: getPostPreview(post),
            commentNickname: sanitized,
            commentDisplayName: comment.nickname,
            commentText: comment.text,
            time: comment.time || post.time,
          };
        })
        .filter(entry => candidateNicknames.has(entry.commentNickname));
    });

    const fallbackCommentEntries = commentedSet.size
      ? allCommentEntries.filter(entry => commentedSet.has(String(entry.postId)))
      : allCommentEntries;

    return {
      postsByUser: postsByUserResult,
      fallbackStories: fallbackStoriesResult,
      empathyPosts: empathyPostsResult,
      fallbackComments: fallbackCommentEntries,
    };
  }, [fallbackPosts, nickname, likedPostIds, commentedPostIds]);

  const stories =
    postsByUser.length > 0
      ? postsByUser
      : fallbackStories;

  const comments = fallbackComments;

  const likes = empathyPosts;

  const storyStatus = { loading: false, error: null };
  const commentStatus = { loading: false, error: null };
  const likeStatus = { loading: false, error: null };

  return {
    posts: fallbackPosts,
    nickname,
    stories,
    likes,
    comments,
    storyStatus,
    commentStatus,
    likeStatus,
  };
}

