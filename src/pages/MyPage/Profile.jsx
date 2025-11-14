import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { c, f, s, typography } from '../../styles/themeUtils';
import PageHeader from '../../components/PageHeader';
import SignUpTitle from '../../components/Signup/SignUpTitle';
import TextField from '../../components/Signup/TextField';
import defaultAvatar from '../../assets/icons/profile/avatar1.svg';
import SignUpChangeIcon from '../../assets/icons/SignUpChange.svg';
import MyPageCameraIcon from '../../assets/icons/MyPageCamera.svg';
import successIcon from '../../assets/icons/PasswordTrue.svg';
import errorIcon from '../../assets/icons/PasswordFalse.svg';
import { updateProfile as updateProfileApi } from '../../api/mypageService';

const normalizeSlug = slug => {
  if (typeof slug !== 'string') return null;
  const trimmed = slug.trim();
  if (!trimmed) return null;
  if (trimmed === 'line4thon') {
    try {
      localStorage.setItem('userSlug', 'line4thon');
    } catch {
      // ignore storage errors
    }
    return 'line4thon';
  }
  return trimmed;
};

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${c('neutral.black2')};
  display: flex;
  flex-direction: column;
  position: relative;
`;

const BlurredBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${c('neutral.black2')};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 1;
  will-change: transform;
  transform: translateZ(0);
`;

const BackgroundContent = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.5;
  filter: blur(8px);
  z-index: 0;
  pointer-events: none;
  will-change: transform;
  transform: translateZ(0);
`;

const StyledHeader = styled.div`
  filter: blur(8px);
  opacity: 0.6;
`;

const StyledTitle = styled.div`
  filter: blur(8px);
  opacity: 0.6;
`;

const StyledFields = styled.div`
  padding: 0 ${s('md')};
  filter: blur(8px);
  opacity: 0.6;
`;

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: ${s('lg')};
`;

const BottomSheet = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${c('neutral.white')};
  border-radius: 24px 24px 0 0;
  padding: ${s('lg')} ${s('md')} ${s('xl')};
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
  z-index: 10;
  will-change: transform;
  overflow-y: auto;
  overflow-x: hidden;
  
  @keyframes slideUp {
    from {
      transform: translateY(100%) translateZ(0);
    }
    to {
      transform: translateY(0) translateZ(0);
    }
  }
`;

const DragHandle = styled.div`
  width: 40px;
  height: 4px;
  background: ${c('neutral.gray')};
  border-radius: 2px;
  margin: 0 auto ${s('md')};
`;

const Title = styled.h1`
  ${typography('headline01')};
  color: ${c('neutral.black')};
  margin-bottom: ${s('xl')};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: ${s('xl')};
  margin-bottom: ${s('xl')};
`;

const ProfileImageContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
`;

const ProfileImageWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
`;

const CameraIconButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  background: none;
  border: none;
  
  img {
    width: 40px;
    height: 40px;
    pointer-events: none;
  }
`;

const NicknameFieldsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TextFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 16px;
  width: 100%;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  position: relative;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px ${({ $hasIcon }) => ($hasIcon ? '48px' : '16px')} 12px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ $status, theme }) => {
    if ($status === 'success') return theme.colors.sub.green;
    if ($status === 'error') return theme.colors.sub.red;
    return theme.colors.neutral.gray;
  }};
  background: ${c('neutral.white')};
  font-family: ${f('typography.body01.family')};
  font-size: ${f('typography.body01.size')};
  font-weight: ${f('typography.body01.weight')};
  color: ${c('neutral.black')};
  line-height: 24px;
  box-sizing: border-box;
  outline: none;

  &::placeholder {
    color: ${c('neutral.gray2')};
  }

  &:focus {
    border-color: ${({ $status, theme }) => {
      if ($status === 'success') return theme.colors.sub.green;
      if ($status === 'error') return theme.colors.sub.red;
      return theme.colors.brand.pink;
    }};
  }

  &:disabled {
    background: ${c('neutral.bg')};
    cursor: not-allowed;
  }
`;

const IconButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;

  img {
    width: 24px;
    height: 24px;
    pointer-events: none;
  }
`;

const HelperText = styled.span`
  font-family: ${f('typography.body02.family')};
  font-size: ${f('typography.body02.size')};
  font-weight: ${f('typography.body02.weight')};
  color: ${({ $status, theme }) => {
    if ($status === 'success') return theme.colors.sub.green;
    if ($status === 'error') return theme.colors.sub.red;
    return 'rgba(44, 50, 73, 0.5)';
  }};
  line-height: normal;
  padding-left: 4px;
`;

function NicknameTextField({ 
  name, 
  placeholder, 
  helperText, 
  value, 
  onChange, 
  onIconClick,
  status 
}) {
  const hasIcon = !!status || !!onIconClick;
  const statusIconSrc = status === 'success' ? successIcon : status === 'error' ? errorIcon : null;

  return (
    <TextFieldContainer>
      <InputWrapper>
        <InputContainer>
          <Input
            id={name}
            name={name}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            $hasIcon={hasIcon}
            $status={status}
          />
          {statusIconSrc && (
            <IconButton type="button" disabled>
              <img src={statusIconSrc} alt={status === 'success' ? '성공' : '에러'} />
            </IconButton>
          )}
          {!status && onIconClick && (
            <IconButton type="button" onClick={onIconClick}>
              <img src={SignUpChangeIcon} alt="랜덤 닉네임" />
            </IconButton>
          )}
        </InputContainer>
        {helperText && <HelperText $status={status}>{helperText}</HelperText>}
      </InputWrapper>
    </TextFieldContainer>
  );
}

const ButtonContainer = styled.div`
  position: sticky;
  bottom: 0;
  margin-top: auto;
  padding-top: ${s('lg')};
  padding-bottom: ${s('md')};
  width: 100%;
  background: ${c('neutral.white')};
  z-index: 1;
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 20px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: ${({ disabled }) => (disabled ? c('neutral.gray') : c('brand.pink'))};
  color: ${c('neutral.white')};
  ${typography('label01')};
  text-align: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s ease;

  &:hover {
    background: ${({ disabled }) => (disabled ? c('neutral.gray') : c('brand.darkPink'))};
  }

  &:active {
    background: ${({ disabled }) => (disabled ? c('neutral.gray') : c('brand.darkPink'))};
  }
`;

// 랜덤 닉네임 생성 함수
const generateRandomNickname = () => {
  const adjectives = [
    '멋진', '귀여운', '행복한', '빛나는', '용감한', '똑똑한', '친절한', '활발한',
    '차분한', '밝은', '강한', '부드러운', '따뜻한', '시원한', '신비로운', '재미있는',
    '상냥한', '유쾌한', '당당한', '자유로운', '창의적인', '열정적인', '긍정적인', '낙천적인',
    '조용한', '웃음짓는', '사랑스러운', '매력적인', '특별한', '독특한', '화려한', '우아한',
    '신나는', '즐거운', '기쁜', '평화로운', '고요한', '편안한', '따스한', '포근한',
    '신선한', '깨끗한', '맑은', '투명한', '순수한', '진실한', '솔직한', '정직한',
    '용기있는', '대담한', '온화한', '부지런한', '성실한', '도전적인', '모험적인', '호기심많은',
    '유연한', '적응력있는'
  ];
  
  const nouns = [
    '고양이', '강아지', '토끼', '햄스터', '다람쥐', '팬더', '곰', '펭귄',
    '돌고래', '나비', '별', '달', '구름', '바람', '물결', '꽃',
    '나무', '산', '바다', '하늘', '별빛', '햇살', '달빛', '무지개',
    '사자', '호랑이', '코끼리', '기린', '얼룩말', '원숭이', '코알라', '캥거루',
    '여우', '늑대', '사슴', '순록', '곰돌이', '판다', '레서팬더', '수달',
    '오리', '백조', '앵무새', '참새', '까마귀', '올빼미', '독수리', '매',
    '장미', '튤립', '해바라기', '벚꽃', '라벤더', '히아신스', '수선화', '프리지아',
    '은하', '혜성', '별똥별', '우주', '행성', '은하수', '성운', '블랙홀',
    '바위', '강', '호수', '폭포', '섬', '숲', '들판', '초원',
    '눈', '비', '번개', '천둥', '안개', '서리', '얼음', '눈송이',
    '모래', '조개', '산호', '진주', '보석', '수정', '다이아몬드', '에메랄드',
    '책', '펜', '종이', '편지', '봉투', '우표', '책상', '의자',
    '컵', '접시', '숟가락', '포크', '나이프', '그릇', '주전자', '티포트',
    '케이크', '쿠키', '초콜릿', '사탕', '아이스크림', '과자', '빵', '도넛'
  ];

  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${randomAdjective} ${randomNoun}`;
};

export default function Profile({ 
  currentNickname = localStorage.getItem('nickname') || '숨쉬는 고양이',
  currentProfileImage
}) {
  const navigate = useNavigate();
  
  // localStorage에서 현재 프로필 정보 가져오기
  const getStoredNickname = () => {
    return localStorage.getItem('nickname') || currentNickname || '숨쉬는 고양이';
  };
  
  const getStoredProfileImage = () => {
    return localStorage.getItem('userProfileImage') || currentProfileImage || defaultAvatar;
  };
  
  const initialNicknameRef = useRef((getStoredNickname() || '').trim());
  const initialProfileImageRef = useRef(getStoredProfileImage());
  const initialNickname = initialNicknameRef.current;
  const initialProfileImage = initialProfileImageRef.current;

  const [formData, setFormData] = useState({
    nickname: initialNickname,
  });
  
  const [profileImage, setProfileImage] = useState(initialProfileImage);
  const [nicknameStatus, setNicknameStatus] = useState(null); // null | 'success' | 'error'
  const [helperMessage, setHelperMessage] = useState('2~8자 이내로 작성해주세요.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 프로필 이미지 업데이트 감지
  useEffect(() => {
    const handleProfileUpdate = () => {
      const storedImage = localStorage.getItem('userProfileImage');
      if (storedImage) {
        setProfileImage(storedImage);
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  // 닉네임 유효성 검사
  const validateNickname = (name) => {
    if (!name || name.trim() === '') return null;
    
    const length = name.trim().length;
    if (length < 2 || length > 8) {
      return false;
    }
    
    // 실제로는 API 호출로 중복 확인해야 함
    // 여기서는 예시로 "뛰었다가 달리는 고양이"는 사용 불가능으로 처리
    const unavailableNames = ['뛰었다가 달리는 고양이', 'test', 'admin'];
    if (unavailableNames.includes(name.trim())) {
      return false;
    }
    
    return true;
  };

  useEffect(() => {
    if (formData.nickname && formData.nickname !== initialNickname) {
      const isValid = validateNickname(formData.nickname);
      if (isValid === null) {
        setNicknameStatus(null);
        setHelperMessage('2~8자 이내로 작성해주세요.');
      } else if (isValid) {
        setNicknameStatus('success');
        setHelperMessage('사용 가능한 닉네임이에요!');
      } else {
        setNicknameStatus('error');
        setHelperMessage('사용 불가능한 닉네임이에요!');
      }
    } else {
      setNicknameStatus(null);
      setHelperMessage('2~8자 이내로 작성해주세요.');
    }
  }, [formData.nickname, initialNickname]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRandomNickname = () => {
    const randomNickname = generateRandomNickname();
    setFormData((prev) => ({
      ...prev,
      nickname: randomNickname,
    }));
  };

  const handleSave = async () => {
    if (isSubmitting) {
      return;
    }

    const trimmedNickname = formData.nickname.trim();
    const nicknameChanged = trimmedNickname !== initialNickname;
    
    // 닉네임이 변경되지 않았으면 저장하지 않음
    if (!nicknameChanged) {
      navigate('/mypage');
      return;
    }

    // 닉네임이 변경되었을 때 유효성 검사
    const canPersistNickname = nicknameStatus === 'success';
    
    if (!canPersistNickname) {
      // 유효성 검사가 아직 완료되지 않았거나 실패한 경우
      const isValid = validateNickname(trimmedNickname);
      if (isValid === false) {
        setNicknameStatus('error');
        setHelperMessage('사용 불가능한 닉네임이에요!');
        return;
      }
      // 유효성 검사는 통과했지만 상태가 업데이트되지 않은 경우
      if (isValid === true) {
        setNicknameStatus('success');
        setHelperMessage('사용 가능한 닉네임이에요!');
      } else {
        setNicknameStatus('error');
        setHelperMessage('2~8자 이내로 작성해주세요.');
        return;
      }
    }

    const nicknameToSave = trimmedNickname;

    const slug =
      (() => {
        try {
          const stored = localStorage.getItem('userSlug');
          const normalized = normalizeSlug(stored);
          return normalized || 'line4thon';
        } catch {
          return 'line4thon';
        }
      })();

    // 로그인 상태 확인
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userId = localStorage.getItem('userId');
    
    if (!isLoggedIn || !userId) {
      window.alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      // 백엔드: 같은 엔드포인트 /{slug}/mypage/profile 사용
      // nickname을 보내면 닉네임 수정, profileImage를 보내면 프로필 사진 수정
      // 백엔드에서 해당 축제(slug) 내에서 닉네임 중복 체크
      console.log('닉네임 수정 API 호출:', {
        isLoggedIn,
        userId,
        slug,
        nickname: nicknameToSave,
        initialNickname,
      });
      
      const response = await updateProfileApi({
        slug,
        nickname: nicknameToSave,
      });

      // 응답 구조 확인을 위한 로깅
      console.log('닉네임 수정 API 응답:', {
        response,
        responseType: typeof response,
        responseKeys: response ? Object.keys(response) : null,
        responseNickname: response?.nickname,
        nicknameToSave,
      });

      // 백엔드 응답: { email, nickname, profileImageUrl, role, slug }
      // 응답이 객체인지 확인하고 닉네임 추출
      const updatedNickname = response?.nickname || response?.data?.nickname || nicknameToSave;
      const updatedProfileImage = response?.profileImageUrl || response?.data?.profileImageUrl || profileImage;
      const updatedRole = response?.role || response?.data?.role;
      const updatedSlug = response?.slug || response?.data?.slug || slug;
      const updatedEmail = response?.email || response?.data?.email;

      console.log('추출된 닉네임 정보:', {
        updatedNickname,
        originalNickname: nicknameToSave,
        responseNickname: response?.nickname,
        responseDataNickname: response?.data?.nickname,
      });

      // localStorage 업데이트
      if (updatedEmail) {
        localStorage.setItem('userId', updatedEmail);
      }
      // 닉네임이 응답에 있으면 업데이트, 없으면 요청한 닉네임 사용
      if (response?.nickname || response?.data?.nickname) {
        localStorage.setItem('nickname', updatedNickname);
        console.log('localStorage 닉네임 업데이트:', updatedNickname);
      } else {
        // 응답에 닉네임이 없어도 요청한 닉네임으로 업데이트
        localStorage.setItem('nickname', nicknameToSave);
        console.log('localStorage 닉네임 업데이트 (응답 없음):', nicknameToSave);
      }
      
      if (updatedProfileImage) {
        localStorage.setItem('userProfileImage', updatedProfileImage);
        setProfileImage(updatedProfileImage);
      }
      if (updatedRole) {
        localStorage.setItem('userRole', updatedRole);
      }
      if (updatedSlug) {
        localStorage.setItem('userSlug', updatedSlug);
      }

      // 프로필 업데이트 이벤트 발생 (다른 컴포넌트에서 닉네임 변경 감지)
      window.dispatchEvent(new CustomEvent('profileUpdated', {
        detail: { nickname: updatedNickname }
      }));
      
      navigate('/mypage');
    } catch (error) {
      // 백엔드: 409 CONFLICT - "이 행사의 닉네임은 이미 사용 중입니다."
      // 403 Forbidden - 인증/권한 문제
      const errorStatus = error?.response?.status || error?.status;
      let message =
        error?.response?.data?.message ||
        error?.data?.message ||
        error?.message ||
        '프로필 수정에 실패했습니다. 다시 시도해주세요.';

      // 403 Forbidden 에러 처리 (인증/권한 문제)
      if (errorStatus === 403) {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userId = localStorage.getItem('userId');
        const userSlug = localStorage.getItem('userSlug');
        
        console.error('403 Forbidden - 세션 확인:', {
          isLoggedIn,
          userId,
          userSlug,
          slug,
          error: error?.response?.data || error?.data,
        });
        
        // 세션이 만료되었거나 권한이 없는 경우
        if (isLoggedIn && userId) {
          // 로그인 상태인데 403이면 세션 만료 또는 권한 문제
          message = '세션이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.';
          // 로그인 페이지로 이동
          if (window.confirm('세션이 만료되었습니다. 로그인 페이지로 이동하시겠습니까?')) {
            navigate('/login');
            return;
          }
        } else {
          // 로그인하지 않은 상태
          message = '로그인이 필요합니다. 로그인 페이지로 이동합니다.';
          navigate('/login');
          return;
        }
      }

      // 409 CONFLICT 에러 처리 (닉네임 중복)
      if (errorStatus === 409) {
        setNicknameStatus('error');
        setHelperMessage('이 행사의 닉네임은 이미 사용 중입니다.');
        message = '이 행사의 닉네임은 이미 사용 중입니다.';
      }

      console.error('닉네임 수정 실패:', {
        status: errorStatus,
        message,
        error,
      });
      window.alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileImageClick = () => {
    // ChangeImage 페이지로 이동
    navigate('/mypage/profile/changeimage');
  };


  // 배경 콘텐츠를 메모이제이션하여 불필요한 리렌더링 방지
  const backgroundContent = useMemo(
    () => (
      <BackgroundContent>
        <StyledHeader>
          <PageHeader title="프로필 변경" />
        </StyledHeader>
        <StyledTitle>
          <SignUpTitle userName={initialNickname} />
        </StyledTitle>
        <StyledFields>
          <FieldsContainer>
            <TextField
              name="email"
              placeholder="이메일 입력"
              helperText="이메일을 입력해주세요."
              value=""
              onChange={() => {}}
              disabled
            />
          </FieldsContainer>
        </StyledFields>
      </BackgroundContent>
    ),
    [initialNickname]
  );

  return (
    <PageContainer>
      {backgroundContent}
      <BlurredBackground />
      <BottomSheet>
        <DragHandle />
        <Title>프로필 변경</Title>
        <Content>
          <ProfileImageContainer>
            <ProfileImageWrapper>
              <ProfileImage src={profileImage} alt="프로필" />
              <CameraIconButton onClick={handleProfileImageClick}>
                <img src={MyPageCameraIcon} alt="카메라" />
              </CameraIconButton>
            </ProfileImageWrapper>
          </ProfileImageContainer>
          <NicknameFieldsContainer>
            <NicknameTextField
              name="nickname"
              placeholder={initialNickname}
              helperText={helperMessage}
              value={formData.nickname}
              onChange={handleChange}
              onIconClick={handleRandomNickname}
              status={nicknameStatus}
            />
          </NicknameFieldsContainer>
        </Content>
        <ButtonContainer>
          <LoginButton onClick={handleSave}>
            수정하기
          </LoginButton>
        </ButtonContainer>
      </BottomSheet>
    </PageContainer>
  );
}
