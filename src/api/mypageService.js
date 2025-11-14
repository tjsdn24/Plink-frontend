import apiClient from './axios';

/**
 * 프로필 수정 API (통합)
 * 백엔드: PATCH /{slug}/mypage/profile
 * 
 * 같은 엔드포인트에서:
 * - nickname을 보내면 닉네임 수정
 * - profileImage 또는 defaultProfileUrl을 보내면 프로필 사진 수정
 * - 둘 다 보낼 수도 있음
 * 
 * 백엔드 로직:
 * - nickname != null && !nickname.isBlank() 조건으로 닉네임 처리
 * - userFestivalRepository.existsByFestivalSlugAndNickname(slug, nickname)로 중복 체크
 * - 중복이면 CustomException(HttpStatus.CONFLICT, "이 행사의 닉네임은 이미 사용 중입니다.")
 * - profileImage 또는 defaultProfileUrl로 프로필 사진 처리
 * - 응답: UserResponse(user, festival) - { email, nickname, profileImageUrl, role, slug }
 * 
 * @param {Object} params - 프로필 수정 파라미터
 * @param {string} params.slug - 축제 slug (path parameter)
 * @param {string|null|undefined} params.nickname - 수정할 닉네임 (nullable, string)
 * @param {File|null|undefined} params.profileImageFile - 프로필 이미지 파일 (nullable, file)
 * @param {string|null|undefined} params.defaultProfileUrl - 기본 프로필 이미지 URL (nullable, string)
 * @returns {Promise<Object>} UserResponse (email, nickname, profileImageUrl, role, slug)
 */
export async function updateProfile({ slug, nickname, profileImageFile, defaultProfileUrl }) {
  const encodedSlug = encodeURIComponent(slug.trim());
  
  // 프로필 이미지 파일이 있으면 FormData 사용, 없으면 JSON 사용
  const hasFile = profileImageFile instanceof File;
  const hasDefaultUrl = typeof defaultProfileUrl === 'string' && defaultProfileUrl.trim() !== '';
  
  if (hasFile || hasDefaultUrl) {
    // 프로필 사진 수정: FormData 사용
    const formData = new FormData();

    // 닉네임도 함께 보낼 수 있음
    if (nickname !== undefined && nickname !== null && String(nickname).trim() !== '') {
      formData.append('nickname', String(nickname).trim());
    }

    if (profileImageFile instanceof File) {
      formData.append('profileImage', profileImageFile);
    }

    if (hasDefaultUrl) {
      formData.append('defaultProfileUrl', defaultProfileUrl.trim());
    }

    try {
      // 디버깅: 요청 정보 로깅
      console.log('프로필 사진 수정 API 요청:', {
        url: `/${encodedSlug}/mypage/profile`,
        slug: encodedSlug,
        hasNickname: !!nickname,
        hasProfileImage: hasFile,
        hasDefaultUrl: hasDefaultUrl,
        withCredentials: true, // axios 인스턴스에서 설정됨
      });
      
      const response = await apiClient.patch(`/${encodedSlug}/mypage/profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // 명시적으로 설정
      });
      return response?.data;
    } catch (error) {
      const errorStatus = error?.response?.status || error?.status;
      const errorData = error?.response?.data || error?.data;
      
      // 백엔드: 409 CONFLICT - "이 행사의 닉네임은 이미 사용 중입니다."
      if (errorStatus === 409) {
        const message = errorData?.message || '이 행사의 닉네임은 이미 사용 중입니다.';
        console.error('닉네임 중복 오류:', {
          status: errorStatus,
          message,
          slug: encodedSlug,
          nickname,
        });
        throw error;
      }
      
      // 403 Forbidden 에러 처리
      if (errorStatus === 403) {
        console.error('403 Forbidden - 인증/권한 문제:', {
          status: errorStatus,
          message: '세션이 만료되었거나 권한이 없습니다.',
          url: `/${encodedSlug}/mypage/profile`,
          // 세션 확인을 위한 정보
          isLoggedIn: localStorage.getItem('isLoggedIn'),
          userId: localStorage.getItem('userId'),
        });
      }
      
      console.error('프로필 수정 API 에러:', {
        status: errorStatus,
        statusText: error?.response?.statusText || error?.statusText,
        data: errorData,
        message: error?.message,
        url: `/${encodedSlug}/mypage/profile`,
      });
      
      throw error;
    }
  } else {
    // 닉네임만 수정: FormData 사용 (백엔드가 FormData로 받도록 요구)
    const formData = new FormData();
    
    const trimmedNickname = nickname !== undefined && nickname !== null 
      ? String(nickname).trim() 
      : null;
    
    // 백엔드 조건: nickname != null && !nickname.isBlank()
    // null이거나 빈 문자열이면 body에 포함하지 않음
    if (trimmedNickname && trimmedNickname !== '') {
      formData.append('nickname', trimmedNickname);
    }
    
    try {
      // 디버깅: 요청 정보 로깅
      console.log('닉네임 수정 API 요청 (FormData):', {
        url: `/${encodedSlug}/mypage/profile`,
        slug: encodedSlug,
        nickname: trimmedNickname,
        withCredentials: true, // axios 인스턴스에서 설정됨
      });
      
      const response = await apiClient.patch(
        `/${encodedSlug}/mypage/profile`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true, // 명시적으로 설정
        }
      );

      // 백엔드 응답: UserResponse(user, festival)
      // { email, nickname, profileImageUrl, role, slug }
      return response?.data;
    } catch (error) {
      const errorStatus = error?.response?.status || error?.status;
      const errorData = error?.response?.data || error?.data;
      
      // 백엔드: 409 CONFLICT - "이 행사의 닉네임은 이미 사용 중입니다."
      if (errorStatus === 409) {
        const message = errorData?.message || '이 행사의 닉네임은 이미 사용 중입니다.';
        console.error('닉네임 중복 오류:', {
          status: errorStatus,
          message,
          slug: encodedSlug,
          nickname: trimmedNickname,
        });
        throw error;
      }
      
      // 403 Forbidden 에러 처리
      if (errorStatus === 403) {
        console.error('403 Forbidden - 인증/권한 문제:', {
          status: errorStatus,
          message: '세션이 만료되었거나 권한이 없습니다.',
          url: `/${encodedSlug}/mypage/profile`,
          nickname: trimmedNickname,
          // 세션 확인을 위한 정보
          isLoggedIn: localStorage.getItem('isLoggedIn'),
          userId: localStorage.getItem('userId'),
        });
      }
      
      console.error('닉네임 수정 API 에러:', {
        status: errorStatus,
        statusText: error?.response?.statusText || error?.statusText,
        data: errorData,
        message: error?.message,
        url: `/${encodedSlug}/mypage/profile`,
        nickname: trimmedNickname,
      });
      
      throw error;
    }
  }
}

/**
 * 닉네임 수정 API (별칭 - 하위 호환성)
 * @deprecated updateProfile을 사용하세요
 */
export async function updateNickname({ slug, nickname }) {
  return updateProfile({ slug, nickname });
}

/**
 * 비밀번호 변경 API
 * 백엔드: PATCH /{slug}/mypage/password
 * 
 * 백엔드 로직:
 * - passwordEncoder.matches(currentPassword, user.getPassword())로 현재 비밀번호 확인
 * - 현재 비밀번호가 일치하지 않으면 CustomException(HttpStatus.UNAUTHORIZED, "현재 비밀번호가 올바르지 않습니다.")
 * - 새 비밀번호를 암호화하여 저장
 * - 성공 시 void 반환
 * 
 * @param {Object} params - 비밀번호 변경 파라미터
 * @param {string} params.slug - 축제 slug (path parameter)
 * @param {string} params.currentPassword - 현재 비밀번호
 * @param {string} params.newPassword - 새 비밀번호
 * @returns {Promise<void>}
 */
export async function changePassword({ slug, currentPassword, newPassword }) {
  const encodedSlug = encodeURIComponent(slug.trim());
  
  // FormData 사용
  const formData = new FormData();
  formData.append('currentPassword', currentPassword.trim());
  formData.append('newPassword', newPassword.trim());
  
  try {
    // 디버깅: 요청 정보 로깅
    console.log('비밀번호 변경 API 요청 (FormData):', {
      url: `/${encodedSlug}/mypage/password`,
      slug: encodedSlug,
      withCredentials: true, // axios 인스턴스에서 설정됨
    });
    
    const response = await apiClient.patch(
      `/${encodedSlug}/mypage/password`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // 명시적으로 설정
      }
    );
    
    // 백엔드가 void를 반환하므로 response?.data는 undefined일 수 있음
    return response?.data;
  } catch (error) {
    const errorStatus = error?.response?.status || error?.status;
    const errorData = error?.response?.data || error?.data;
    
    // 백엔드: 401 UNAUTHORIZED - "현재 비밀번호가 올바르지 않습니다."
    if (errorStatus === 401) {
      const message = errorData?.message || '현재 비밀번호가 올바르지 않습니다.';
      console.error('비밀번호 변경 오류:', {
        status: errorStatus,
        message,
        slug: encodedSlug,
      });
      throw error;
    }
    
    // 403 Forbidden 에러 처리
    if (errorStatus === 403) {
      console.error('403 Forbidden - 인증/권한 문제:', {
        status: errorStatus,
        message: '세션이 만료되었거나 권한이 없습니다.',
        url: `/${encodedSlug}/mypage/password`,
        // 세션 확인을 위한 정보
        isLoggedIn: localStorage.getItem('isLoggedIn'),
        userId: localStorage.getItem('userId'),
      });
    }
    
    console.error('비밀번호 변경 API 에러:', {
      status: errorStatus,
      statusText: error?.response?.statusText || error?.statusText,
      data: errorData,
      message: error?.message,
      url: `/${encodedSlug}/mypage/password`,
    });
    
    throw error;
  }
}

export const mypageService = {
  updateProfile,
  updateNickname, // 하위 호환성을 위해 유지
  changePassword,
};
