import { useMemo } from 'react';
import {
  sanitizeNickname,
  loadPostsFromStorage,
  getPostPreview,
} from './activityUtils';

export function useActivityData() {
  const posts = useMemo(() => loadPostsFromStorage(), []);

  const nickname = useMemo(() => {
    const stored = localStorage.getItem('nickname');
    if (!stored) return null;
    return sanitizeNickname(stored);
  }, []);

  const likedPostIds = useMemo(() => {
    const saved = localStorage.getItem('userLikedPostIds');
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }, []);

  const commentedPostIds = useMemo(() => {
    const saved = localStorage.getItem('userCommentedPostIds');
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }, []);

  const activityMap = useMemo(() => {
    const likedSet = new Set(likedPostIds.map(String));
    const commentedSet = new Set(commentedPostIds.map(String));

    const normalizedNickname = nickname;
    const fallbackNickname = '익명의 사용자';

    const postsByUser = normalizedNickname
      ? posts.filter(post => sanitizeNickname(post.nickname) === normalizedNickname)
      : [];

    const fallbackPosts = posts.filter(
      post => sanitizeNickname(post.nickname) === fallbackNickname
    );

    const storyPosts = postsByUser.length > 0 ? postsByUser : fallbackPosts;

    const empathyPosts = posts.filter(post => likedSet.has(String(post.id)));

    const candidateNicknames = new Set();
    if (normalizedNickname) candidateNicknames.add(normalizedNickname);
    candidateNicknames.add(fallbackNickname);

    const allCommentEntries = posts.flatMap(post => {
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

    const commentEntries = commentedSet.size
      ? allCommentEntries.filter(entry => commentedSet.has(String(entry.postId)))
      : allCommentEntries;

    return {
      story: storyPosts,
      empathy: empathyPosts,
      comment: commentEntries,
    };
  }, [posts, nickname, likedPostIds, commentedPostIds]);

  return {
    posts,
    nickname,
    stories: activityMap.story,
    likes: activityMap.empathy,
    comments: activityMap.comment,
  };
}

