import apiClient from '../axios';

const DEFAULT_ERROR_MESSAGE = '내가 작성한 글을 불러오지 못했어요. 잠시 후 다시 시도해주세요.';

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
  return [];
};

const adaptPoll = poll => {
  if (!poll || !Array.isArray(poll?.result)) return null;

  const options = [];
  const votes = [];

  poll.result.forEach(entry => {
    const optionId = entry?.optionId || null;
    const content = entry?.content || '';
    const voteCount = Number(entry?.voteCount) || 0;
    const voteRate = Number(entry?.voteRate) || 0;

    options.push({
      id: optionId,
      text: content,
      voteCount,
      voteRate,
    });
    votes.push(voteCount);
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

/**
 * 게시글 데이터를 프론트엔드에서 사용하기 쉬운 형태로 변환
 * @param {Object} rawPost - 백엔드에서 받은 게시글 데이터
 * @returns {Object|null} 변환된 게시글 데이터
 */
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

/**
 * 내가 작성한 게시글 목록 조회 API
 * 백엔드: GET /{slug}/mypage/posts
 * 
 * Response 필드:
 * - id (int): 게시글 아이디
 * - postType (string): 일반글 / 앙케이트
 * - title (string): 제목
 * - content (string): 내용
 * - author (string): 작성자
 * - profileImageUrl (string): 프로필사진
 * - tagName (string): 태그 이름
 * - createdAt (DATETIME): 생성일
 * - updatedAt (DATETIME): 수정일
 * - imageUrls (string): 이미지 url
 * - commentCount (int): 댓글 수
 * - likeCount (int): 좋아요 수
 * - poll: 앙케이트 정보 (POLL 타입인 경우)
 *   - pollId (int): 앙케이트 아이디
 *   - selectedOptionId (int): 사용자가 고른 선택지 아이디
 *   - result (list): 앙케이트 결과
 *     - optionId (int): 선택지 아이디
 *     - content (string): 선택지 내용
 *     - voteCount (int): 득표수
 *     - voteRate (int): 백분율
 * 
 * @param {Object} params - 파라미터
 * @param {string} params.slug - 축제 slug (path parameter, required)
 * @param {AbortSignal} params.signal - 요청 취소를 위한 AbortSignal (optional)
 * @returns {Promise<Array>} 게시글 목록 배열
 */
export async function getMyPosts({ slug, signal } = {}) {
  if (!slug || typeof slug !== 'string') {
    throw new Error('slug는 문자열이어야 합니다.');
  }

  try {
    const encodedSlug = encodeURIComponent(slug.trim());
    const response = await apiClient.get(`/${encodedSlug}/mypage/posts`, {
      signal,
      withCredentials: true,
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

