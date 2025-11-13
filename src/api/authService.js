import apiClient from './axios';

export async function signupUser({
  email,
  nickname,
  password,
  slug,
  profileImageFile,
}) {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('nickname', nickname);
  formData.append('password', password);
  formData.append('slug', slug);
  if (profileImageFile instanceof File) {
    formData.append('profileImage', profileImageFile);
  }

  const response = await apiClient.post('/auth/signup', formData);

  return response?.data;
}

export async function loginUser({ email, password }) {
  const response = await apiClient.post('/auth/login', {
    email,
    password,
  });

  return response?.data;
}

export async function logoutUser({ email, password }) {
  const response = await apiClient.post('/auth/logout', {
    email,
    password,
  });

  return response?.data;
}

export async function createGuestAccount({ nickname, slug, profileImageFile }) {
  const formData = new FormData();
  formData.append('nickname', nickname);
  formData.append('slug', slug);

  if (profileImageFile instanceof File) {
    formData.append('profileImage', profileImageFile);
  }

  const response = await apiClient.post('/auth/guest', formData);

  return response?.data;
}

export const authService = {
  signupUser,
  loginUser,
  logoutUser,
  createGuestAccount,
};
