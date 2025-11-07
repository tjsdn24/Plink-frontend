import { postData as initialPosts } from '../Chat/PostData';

export const sanitizeNickname = nickname => nickname?.replace(/님!?$/, '').trim();

export const ensurePostIds = posts => {
  const generator = () => Date.now() + Math.random().toString(36).slice(2, 9);
  return posts.map(post => (post.id ? post : { ...post, id: generator() }));
};

export const loadPostsFromStorage = () => {
  const stored = localStorage.getItem('posts');
  try {
    return ensurePostIds(stored ? JSON.parse(stored) : initialPosts);
  } catch (error) {
    console.error('Failed to parse posts:', error);
    return ensurePostIds(initialPosts);
  }
};

export const extractSearchableText = post => {
  const textChunks = [];
  if (post.nickname) textChunks.push(post.nickname);
  if (Array.isArray(post.content)) {
    post.content.forEach(item => {
      if (item?.type === 'text' && typeof item.data === 'string') {
        textChunks.push(item.data);
      }
    });
  }
  return textChunks.join(' ').toLowerCase();
};

export const getPostPreview = post => {
  if (!Array.isArray(post.content)) return '';
  const textItem = post.content.find(item => item?.type === 'text');
  return textItem?.data || '';
};

