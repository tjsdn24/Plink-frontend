import apiClient from '../axios';

const DEFAULT_ERROR_MESSAGE = '공감한 이야기를 불러오지 못했어요. 잠시 후 다시 시도해주세요.';

const normalizeError = error => {
  if (!error) return DEFAULT_ERROR_MESSAGE;
  if (typeof error === 'string') return error || DEFAULT_ERROR_MESSAGE;

  return error?.data?.message || error?.message || error?.statusText || DEFAULT_ERROR_MESSAGE;
};

const resolveDataArray = data => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.posts)) return data.posts;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.likes)) return data.likes;
  return [];
};

const adaptPoll = poll => {
  if (!poll || !Array.isArray(poll?.result)) return null;

  const options = [];
  const votes = [];

  poll.result.forEach(entry => {
    options.push(entry?.content ?? '');
    votes.push(Number(entry?.voteCount) || 0);
  });

  return {
    options,
    votes,
    pollId: poll?.pollId ?? null,
    selectedOptionId: poll?.selectedOptionId ?? null,
    raw: poll,
  };
};

const ensureArray = value => {
  if (Array.isArray(value)) {
    return value.filter(item => !!item);
  }

  if (!value && value !== 0) return [];

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter(item => !!item);
      }
    } catch {
      // fall through to comma split
    }

    return trimmed
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  }

  return [value];
};

const formatRelativeTime = isoString => {
  if (!isoString) return '';

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return typeof isoString === 'string' ? isoString : '';
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (diffMs < 0) return '방금 전';

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}일 전`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) return `${diffWeeks}주 전`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}개월 전`;

  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears}년 전`;
};

const adaptPost = rawPost => {
  if (!rawPost || typeof rawPost !== 'object') {
    return null;
  }

  const {
    id,
    postType,
    title,
    content,
    author,
    profileImageUrl,
    tagName,
    createdAt,
    updatedAt,
    imageUrls,
    commentCount,
    likeCount,
    poll,
  } = rawPost;

  const contentItems = [];

  if (title && typeof title === 'string') {
    contentItems.push({ type: 'text', data: title });
  }

  if (content && typeof content === 'string') {
    contentItems.push({ type: 'text', data: content });
  }

  const parsedImages = ensureArray(imageUrls);
  if (parsedImages.length > 0) {
    contentItems.push({ type: 'images', data: parsedImages });
  }

  const pollData = adaptPoll(poll);
  if (pollData) {
    contentItems.push({ type: 'poll', data: pollData });
  }

  if (contentItems.length === 0) {
    contentItems.push({ type: 'text', data: '내용이 없습니다.' });
  }

  return {
    id,
    nickname: author || '익명',
    content: contentItems,
    like: Number(likeCount) || 0,
    comment: Number(commentCount) || 0,
    comments: [],
    time: formatRelativeTime(createdAt || updatedAt),
    category: tagName || postType || '기타',
    postType: postType || null,
    profileImageUrl: profileImageUrl || null,
    raw: rawPost,
  };
};

export async function getMyLikedPosts({ slug, signal } = {}) {
  if (!slug || typeof slug !== 'string') {
    throw new Error('slug는 문자열이어야 합니다.');
  }

  try {
    const encodedSlug = encodeURIComponent(slug.trim());
    const response = await apiClient.get(`/${encodedSlug}/mypage/liked`, {
      signal,
    });

    const rawData = response?.data ?? [];
    const posts = resolveDataArray(rawData)
      .map(adaptPost)
      .filter(Boolean);
    return posts;
  } catch (error) {
    const normalizedError = normalizeError(error);
    const err = new Error(normalizedError);
    err.cause = error;
    throw err;
  }
}






