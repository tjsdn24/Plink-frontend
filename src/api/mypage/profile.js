import apiClient from '../axios';

const DEFAULT_ERROR_MESSAGE = '프로필 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.';

const normalizeError = error => {
  if (!error) return DEFAULT_ERROR_MESSAGE;
  if (typeof error === 'string') return error || DEFAULT_ERROR_MESSAGE;
  return error?.data?.message || error?.message || error?.statusText || DEFAULT_ERROR_MESSAGE;
};

export async function fetchMyProfile({ slug, signal } = {}) {
  if (!slug || typeof slug !== 'string') {
    throw new Error('slug는 문자열이어야 합니다.');
  }

  try {
    const encodedSlug = encodeURIComponent(slug.trim());
    const response = await apiClient.get(`/${encodedSlug}/mypage/profile`, { signal });
    return response?.data;
  } catch (error) {
    const normalized = normalizeError(error);
    const err = new Error(normalized);
    err.cause = error;
    throw err;
  }
}

export async function updateProfile({
  slug,
  nickname,
  profileImageFile,
  defaultProfileUrl,
  signal,
} = {}) {
  if (!slug || typeof slug !== 'string') {
    throw new Error('slug는 문자열이어야 합니다.');
  }

  const formData = new FormData();

  if (typeof nickname === 'string' && nickname.trim()) {
    formData.append('nickname', nickname.trim());
  }

  if (profileImageFile instanceof File) {
    formData.append('profileImage', profileImageFile);
  }

  if (typeof defaultProfileUrl === 'string' && defaultProfileUrl.trim()) {
    formData.append('defaultProfileUrl', defaultProfileUrl.trim());
  }

  try {
    const encodedSlug = encodeURIComponent(slug.trim());
    const response = await apiClient.patch(`/${encodedSlug}/mypage/profile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      signal,
    });
    return response?.data;
  } catch (error) {
    const normalized = normalizeError(error);
    const err = new Error(normalized);
    err.cause = error;
    throw err;
  }
}

export const mypageProfileApi = {
  fetchMyProfile,
  updateProfile,
};


