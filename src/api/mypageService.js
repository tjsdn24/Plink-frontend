import apiClient from './axios';

export async function updateNickname({ slug, nickname }) {
  const encodedSlug = encodeURIComponent(slug.trim());
  const response = await apiClient.patch(`/${encodedSlug}/mypage/nickname`, { nickname });

  return response?.data;
}

export async function updateProfile({ slug, nickname, profileImageFile, defaultProfileUrl }) {
  const formData = new FormData();

  if (nickname && nickname.trim() !== '') {
    formData.append('nickname', nickname.trim());
  }

  if (profileImageFile instanceof File) {
    formData.append('profileImage', profileImageFile);
  }

  if (typeof defaultProfileUrl === 'string' && defaultProfileUrl.trim() !== '') {
    formData.append('defaultProfileUrl', defaultProfileUrl.trim());
  }

  const encodedSlug = encodeURIComponent(slug.trim());
  const response = await apiClient.patch(`/${encodedSlug}/mypage/profile`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response?.data;
}

export const mypageService = {
  updateNickname,
  updateProfile,
};
