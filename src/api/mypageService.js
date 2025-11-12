import axios from 'axios';

const API_BASE_URL =
  (import.meta.env?.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.trim()) ||
  'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export async function updateNickname({ slug, nickname }) {
  const response = await api.patch(
    `/${slug}/mypage/nickname`,
    { nickname },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

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

  const response = await api.patch(`/${slug}/mypage/profile`, formData);
  return response?.data;
}

export const mypageService = {
  updateNickname,
  updateProfile,
};
