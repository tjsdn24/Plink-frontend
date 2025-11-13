export const isGuestSession = () => {
  try {
    return localStorage.getItem('isGuest') === 'true';
  } catch (error) {
    console.error('게스트 세션 확인 실패', error);
    return false;
  }
};

export const sanitizeNickname = nickname => {
  if (typeof nickname !== 'string') return '';
  return nickname.replace(/님!?$/, '');
};

export const getStoredNickname = () => {
  try {
    const storedNickname = localStorage.getItem('nickname');
    if (!storedNickname) {
      return '';
    }
    return sanitizeNickname(storedNickname);
  } catch (error) {
    console.error('닉네임 조회 실패', error);
    return '';
  }
};

export const getStoredSlug = (fallback = 'line4thon') => {
  try {
    return localStorage.getItem('userSlug') || fallback;
  } catch (error) {
    console.error('슬러그 조회 실패', error);
    return fallback;
  }
};

export const getStoredEmail = () => {
  try {
    return localStorage.getItem('userId') || '';
  } catch (error) {
    console.error('이메일 조회 실패', error);
    return '';
  }
};

export const clearGuestSession = () => {
  try {
    const keysToClear = [
      'nickname',
      'userId',
      'userProfileImage',
      'userRole',
      'isGuest',
      'userSlug',
    ];

    keysToClear.forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('게스트 세션 초기화 실패', error);
  }
};


