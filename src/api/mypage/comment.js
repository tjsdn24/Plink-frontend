import apiClient from '../axios';

const DEFAULT_ERROR_MESSAGE = '내가 작성한 댓글을 불러오지 못했어요. 잠시 후 다시 시도해주세요.';

const normalizeError = error => {
  if (!error) return DEFAULT_ERROR_MESSAGE;
  if (typeof error === 'string') return error || DEFAULT_ERROR_MESSAGE;

  return error?.data?.message || error?.message || error?.statusText || DEFAULT_ERROR_MESSAGE;
};

const resolveDataArray = data => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.comments)) return data.comments;
  if (Array.isArray(data?.content)) return data.content;
  return [];
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
 * 댓글 데이터를 프론트엔드에서 사용하기 쉬운 형태로 변환
 * @param {Object} rawComment - 백엔드에서 받은 댓글 데이터
 * @returns {Object|null} 변환된 댓글 데이터
 */
const adaptComment = rawComment => {
  if (!rawComment || typeof rawComment !== 'object') {
    return null;
  }

  const {
    id,
    author,
    profileImageUrl,
    content,
    createdAt,
    updatedAt,
    likeCount,
    postTitle,
    postId,
  } = rawComment;

  return {
    id: Number(id) || null,
    author: author || '익명',
    profileImageUrl: profileImageUrl || null,
    content: content || '',
    commentText: content || '', // ActivityLayout에서 사용하는 필드명
    createdAt: createdAt || null,
    updatedAt: updatedAt || null,
    time: formatRelativeTime(createdAt || updatedAt),
    likeCount: Number(likeCount) || 0,
    postTitle: postTitle || '',
    postPreview: postTitle || '', // ActivityLayout에서 사용하는 필드명
    postId: Number(postId) || null,
    postNickname: null, // 필요시 추가
    raw: rawComment,
  };
};

/**
 * 내가 작성한 댓글 목록 조회 API
 * 백엔드: GET /{slug}/mypage/comments
 * 
 * Response 필드:
 * - id (int): 댓글 아이디
 * - author (string): 작성자
 * - profileImageUrl (string): 프로필 사진
 * - content (string): 내용
 * - createdAt (DATETIME): 생성일
 * - updatedAt (DATETIME): 수정일
 * - likeCount (int): 좋아요 숫자
 * - postTitle (string): 해당 게시글 제목
 * - postId (int): 해당 게시글 아이디
 * 
 * @param {Object} params - 파라미터
 * @param {string} params.slug - 축제 slug (path parameter, required)
 * @param {AbortSignal} params.signal - 요청 취소를 위한 AbortSignal (optional)
 * @returns {Promise<Array>} 댓글 목록 배열
 */
export async function getMyComments({ slug, signal } = {}) {
  if (!slug || typeof slug !== 'string') {
    throw new Error('slug는 문자열이어야 합니다.');
  }

  try {
    const encodedSlug = encodeURIComponent(slug.trim());
    const response = await apiClient.get(`/${encodedSlug}/mypage/comments`, {
      signal,
      withCredentials: true,
    });

    const rawData = response?.data ?? [];
    const comments = resolveDataArray(rawData)
      .map(adaptComment)
      .filter(Boolean);
    
    return comments;
  } catch (error) {
    const normalizedError = normalizeError(error);
    const err = new Error(normalizedError);
    err.cause = error;
    throw err;
  }
}


