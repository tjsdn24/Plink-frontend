import axios from 'axios';

const API_BASE_URL =
  (import.meta.env?.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.trim()) ||
  'http://localhost:8080';

export async function signupUser({ email, nickname, password, slug }) {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('nickname', nickname);
  formData.append('password', password);
  formData.append('slug', slug);

  const response = await axios.post(`${API_BASE_URL}/auth/signup`, formData, {
    withCredentials: true,
  });

  return response?.data;
}

export async function loginUser({ email, password }) {
  const response = await axios.post(
    `${API_BASE_URL}/auth/login`,
    {
      email,
      password,
    },
    {
      withCredentials: true,
    }
  );

  return response?.data;
}

export async function logoutUser({ email, password }) {
  const response = await axios.post(
    `${API_BASE_URL}/auth/logout`,
    {
      email,
      password,
    },
    {
      withCredentials: true,
    }
  );

  return response?.data;
}

export async function createGuestAccount({ nickname, slug, profileImageFile }) {
  const formData = new FormData();
  formData.append('nickname', nickname);
  formData.append('slug', slug);

  if (profileImageFile instanceof File) {
    formData.append('profileImage', profileImageFile);
  }

  const response = await axios.post(`${API_BASE_URL}/auth/guest`, formData, {
    withCredentials: true,
  });

  return response?.data;
}

export const authService = {
  signupUser,
  loginUser,
  logoutUser,
  createGuestAccount,
};
