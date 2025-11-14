export const isGuestSession = () => {
  try {
    return localStorage.getItem('isGuest') === 'true';
  } catch (error) {
    console.error('게스트 세션 확인 실패', error);
    return false;
  }
};

export const isUserRole = () => {
  try {
    return localStorage.getItem('userRole') === 'USER';
  } catch (error) {
    console.error('사용자 역할 확인 실패', error);
    return false;
  }
};

export const canWritePost = () => {
  try {
    // ROLE이 USER인 경우에만 작성 가능
    return localStorage.getItem('userRole') === 'USER';
  } catch (error) {
    console.error('게시글 작성 권한 확인 실패', error);
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
    // 게스트 닉네임은 원본 그대로 반환 (백엔드와 정확히 일치해야 함)
    return storedNickname;
  } catch (error) {
    console.error('닉네임 조회 실패', error);
    return '';
  }
};

// sanitize된 닉네임이 필요한 경우 사용
export const getStoredNicknameSanitized = () => {
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


