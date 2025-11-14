import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { c, s, typography } from '../../styles/themeUtils';
import Header from '../../components/Header';
import FestivalCard from '../../components/Festival/FestivalCard';
import Firework from './Firework';
import SearchIcon from '../../assets/icons/SearchIcon.svg';
import ChatArrowIcon from '../../assets/icons/ChatArrowDown.svg';
import FestivalImage from '../../assets/images/4호선톤.webp';
import { createGuestAccount } from '../../api/authService';
import avatar1 from '../../assets/icons/profile/avatar1.svg';
import avatar2 from '../../assets/icons/profile/avatar2.svg';
import avatar3 from '../../assets/icons/profile/avatar3.svg';
import avatar4 from '../../assets/icons/profile/avatar4.svg';
import avatar5 from '../../assets/icons/profile/avatar5.svg';

const DEFAULT_SLUG = 'line4thon';

const avatarPool = [avatar1, avatar2, avatar3, avatar4, avatar5];

const getRandomAvatarSrc = () => {
  const randomIndex = Math.floor(Math.random() * avatarPool.length);
  return avatarPool[randomIndex];
};

const createFileFromAsset = async assetUrl => {
  if (!assetUrl) return null;
  try {
    const response = await fetch(assetUrl);
    const blob = await response.blob();
    const extension = assetUrl.split('.').pop()?.split('?')[0] || 'svg';
    const fileName = `guest-avatar-${Date.now()}.${extension}`;
    const type = blob.type || `image/${extension}`;
    return new File([blob], fileName, { type });
  } catch (error) {
    console.error('게스트 아바타 파일 생성 실패', error);
    return null;
  }
};

// 랜덤 닉네임 생성 함수
const generateRandomNickname = () => {
  const adjectives = [
    '멋진',
    '귀여운',
    '행복한',
    '빛나는',
    '용감한',
    '똑똑한',
    '친절한',
    '활발한',
    '차분한',
    '밝은',
    '강한',
    '부드러운',
    '따뜻한',
    '시원한',
    '신비로운',
    '재미있는',
    '화려한',
    '우아한',
    '자유로운',
    '열정적인',
    '평화로운',
    '즐거운',
    '기쁜',
    '사랑스러운',
    '아름다운',
    '순수한',
    '깨끗한',
    '새로운',
    '신선한',
    '특별한',
    '독특한',
    '창의적인',
    '영리한',
    '빠른',
    '느긋한',
    '조용한',
    '명랑한',
  ];

  const nouns = [
    '고양이',
    '강아지',
    '토끼',
    '햄스터',
    '다람쥐',
    '팬더',
    '곰',
    '펭귄',
    '돌고래',
    '나비',
    '별',
    '달',
    '구름',
    '바람',
    '물결',
    '꽃',
    '나무',
    '산',
    '바다',
    '하늘',
    '별빛',
    '햇살',
    '달빛',
    '무지개',
    '눈멍이',
    '사자',
    '호랑이',
    '코끼리',
    '기린',
    '얼룩말',
    '원숭이',
    '캥거루',
    '코알라',
    '여우',
    '늑대',
    '사슴',
    '말',
    '소',
    '양',
    '염소',
    '돼지',
    '닭',
    '오리',
    '거위',
    '백조',
    '도마뱀',
  ];

  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${randomAdjective} ${randomNoun}`;
};

// 여러 닉네임 생성 (카드 회전용)
const generateNicknamePool = (count = 20) => {
  const pool = [];
  for (let i = 0; i < count; i++) {
    pool.push(generateRandomNickname());
  }
  return pool;
};

export default function Welcome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(true);
  const [finalNickname, setFinalNickname] = useState('');
  const [showFirework, setShowFirework] = useState(false);
  const [nicknameList, setNicknameList] = useState([]);
  const [slotVariants, setSlotVariants] = useState({
    initial: { opacity: 1, y: 60 },
    animate: { opacity: 0.8, y: -60 },
    exit: { opacity: 0, y: 60 },
    transition: { duration: 0.08, times: [0, 1] },
  });
  const slotItemRef = useRef(null);
  const stopTimeoutRef = useRef(null);

  const guestMode = location.state?.guest === true;
  const guestSlug = location.state?.slug || DEFAULT_SLUG;

  const festival = location.state?.festival || {
    id: 1,
    name: '4호선톤',
    hashtags: '#해커톤 #멋사',
    date: '2025.11.15',
    location: '국민대학교',
    image: FestivalImage,
    dday: 'D-DAY',
  };

  // 더미 축제 데이터 (배경에 표시)
  const festivals = [festival];

  // 로그인 상태 확인
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // 회원가입 시 선택한 닉네임 가져오기 (로그인 상태일 때만)
  const getRegisteredNickname = () => {
    if (isLoggedIn) {
      const storedNickname = localStorage.getItem('nickname');
      if (storedNickname) {
        // "님!" 제거
        return storedNickname.replace(/님!?$/, '');
      }
    }
    return null;
  };

  const registeredNickname = getRegisteredNickname();

  // 애니메이션이 완료되면 호출되는 함수
  const onAnimationComplete = useCallback(() => {
    if (isSpinning) {
      // 다음 슬롯으로 이동
      setCurrentIndex(prev => (prev + 1) % nicknameList.length);
    }
  }, [isSpinning, nicknameList.length]);

  // 닉네임 리스트 초기화 및 슬롯 시작 (비로그인 상태일 때만)
  useEffect(() => {
    // 로그인 상태면 슬롯 효과 없이 바로 표시
    if (isLoggedIn && registeredNickname) {
      setFinalNickname(registeredNickname);
      setIsSpinning(false);
      setShowFirework(true);

      // 환영 페이지를 본 것으로 기록
      const welcomedFestivals = JSON.parse(localStorage.getItem('welcomedFestivals') || '[]');
      if (!welcomedFestivals.includes(festival.id)) {
        welcomedFestivals.push(festival.id);
        localStorage.setItem('welcomedFestivals', JSON.stringify(welcomedFestivals));
      }

      // 2초 후 홈으로 이동
      setTimeout(() => {
        navigate('/');
      }, 2000);
      return;
    }

    // 비로그인 상태: 슬롯 효과 있음
    const pool = generateNicknamePool(50);
    // 최종 닉네임을 리스트에 추가
    const finalNickname = generateRandomNickname();
    pool.push(finalNickname);
    setNicknameList(pool);
    setCurrentIndex(0);

    const speedTimers = [];

    // 슬롯 속도 변화 함수
    const changeSlotSpeed = (delay, speed) => {
      const timer = setTimeout(() => {
        setSlotVariants(prev => ({
          ...prev,
          transition: { duration: speed, times: [0, 1] },
        }));
      }, delay);
      speedTimers.push(timer);
    };

    // 슬롯 멈추기 함수 (더 빠른 속도로 시작)
    changeSlotSpeed(0, 0.08); // 초기 빠른 속도
    changeSlotSpeed(200, 0.15); // 속도 줄이기 1
    changeSlotSpeed(1200, 0.3); // 속도 줄이기 2
    changeSlotSpeed(2200, 0.6); // 속도 줄이기 3
    changeSlotSpeed(3200, 1.2); // 속도 줄이기 4

    stopTimeoutRef.current = setTimeout(async () => {
      // 최종 닉네임 인덱스로 이동
      const finalIndex = pool.length - 1;
      setCurrentIndex(finalIndex);

      // 슬롯 멈추기
      setSlotVariants({
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 0 },
        transition: { duration: 0.001, times: [0, 1] },
      });
      setIsSpinning(false);

      // 최종 닉네임 선택
      setFinalNickname(finalNickname);
      let resolvedNickname = finalNickname;
      let resolvedProfileImageUrl = null;
      let avatarSrc = null;

      if (guestMode) {
        try {
          avatarSrc = getRandomAvatarSrc();
          const avatarFile = await createFileFromAsset(avatarSrc);
          const guestResponse = await createGuestAccount({
            nickname: finalNickname,
            slug: guestSlug,
            profileImageFile: avatarFile,
          });

          // 백엔드 응답의 닉네임을 우선 사용 (백엔드에 저장된 정확한 닉네임)
          // 백엔드: festival.getNickname().equals(newNickname) 체크를 위해 정확히 일치해야 함
          resolvedNickname = guestResponse?.nickname || finalNickname;
          resolvedProfileImageUrl = guestResponse?.profileImageUrl || avatarSrc || null;

          const guestRole = guestResponse?.role || 'GUEST';
          const guestSlugValue = guestSlug;

          // 게스트 로그인 시 userId는 저장하지 않음 (회원가입 시 이메일로 설정됨)
          localStorage.removeItem('userId');
          // 백엔드 응답의 닉네임을 저장 (백엔드와 정확히 일치하도록)
          localStorage.setItem('nickname', resolvedNickname);
          if (resolvedProfileImageUrl) {
            localStorage.setItem('userProfileImage', resolvedProfileImageUrl);
          } else {
            localStorage.removeItem('userProfileImage');
          }
          localStorage.setItem('userRole', guestRole);
          localStorage.setItem('userSlug', guestSlugValue);
          localStorage.setItem('isGuest', 'true');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('userPassword');
        } catch (error) {
          console.error('게스트 로그인 실패', error);
          localStorage.setItem('nickname', finalNickname);
          if (avatarSrc) {
            resolvedProfileImageUrl = avatarSrc;
            localStorage.setItem('userProfileImage', avatarSrc);
          } else {
            localStorage.removeItem('userProfileImage');
          }
          localStorage.setItem('userRole', 'GUEST');
          localStorage.setItem('userSlug', guestSlug);
          // 게스트 로그인 시 userId는 저장하지 않음 (회원가입 시 이메일로 설정됨)
          localStorage.removeItem('userId');
          localStorage.setItem('isGuest', 'true');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('userPassword');
        }
      } else {
        localStorage.setItem('nickname', finalNickname);
      }

      setFinalNickname(resolvedNickname);

      if (!resolvedProfileImageUrl && !guestMode) {
        localStorage.removeItem('userProfileImage');
      } else if (resolvedProfileImageUrl) {
        localStorage.setItem('userProfileImage', resolvedProfileImageUrl);
      }

      // 환영 페이지를 본 것으로 기록
      const welcomedFestivals = JSON.parse(localStorage.getItem('welcomedFestivals') || '[]');
      if (!welcomedFestivals.includes(festival.id)) {
        welcomedFestivals.push(festival.id);
        localStorage.setItem('welcomedFestivals', JSON.stringify(welcomedFestivals));
      }

      // 폭죽 효과 시작
      setShowFirework(true);

      // 4초 후 홈 또는 축제 목록으로 이동 (폭죽 효과와 닉네임, 환영 메시지를 충분히 볼 수 있도록)
      setTimeout(() => {
        navigate('/');
      }, 4000);
    }, 4700); // 5200ms -> 4700ms (0.5초 감소)

    return () => {
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
      }
      speedTimers.forEach(timer => clearTimeout(timer));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, registeredNickname, festival.id]);

  return (
    <PageWrapper>
      <FixedHeader>
        <Header />
      </FixedHeader>

      <PageContainer>
        <SearchBarContainer>
          <SearchBar>
            <SearchInput type="text" placeholder="원하는 축제를 검색해보세요." readOnly />
            <SearchIconWrapper>
              <SearchIconImg src={SearchIcon} alt="검색" />
            </SearchIconWrapper>
          </SearchBar>
        </SearchBarContainer>

        <TitleSection>
          <Title>축제 명단</Title>
          <SortContainer>
            <SortText>최신순</SortText>
            <SortArrow src={ChatArrowIcon} alt="정렬" />
          </SortContainer>
        </TitleSection>

        <FestivalList>
          {festivals.map(fest => (
            <FestivalCard key={fest.id} festival={fest} disabled={true} />
          ))}
        </FestivalList>
      </PageContainer>

      {/* 닉네임 회전 중 및 멈춘 후 오버레이 */}
      {(nicknameList.length > 0 || finalNickname) && (
        <WelcomeOverlay>
          <WelcomeText>
            <SlotContainer>
              {isSpinning && nicknameList.length > 0 ? (
                <AnimatePresence>
                  <motion.div
                    key={currentIndex}
                    ref={slotItemRef}
                    variants={slotVariants}
                    initial={slotVariants.initial}
                    animate={slotVariants.animate}
                    transition={slotVariants.transition}
                    onAnimationComplete={onAnimationComplete}
                  >
                    <SlotItemBox>{nicknameList[currentIndex]}님!</SlotItemBox>
                  </motion.div>
                </AnimatePresence>
              ) : (
                finalNickname && <SlotItemBox>{finalNickname}님!</SlotItemBox>
              )}
            </SlotContainer>
            {!isSpinning && finalNickname && (
              <WelcomeLine>
                <span className="festival-name">{festival.name}</span>에 오신 것을 환영합니다!
              </WelcomeLine>
            )}
          </WelcomeText>
        </WelcomeOverlay>
      )}

      {/* 폭죽 효과 */}
      {showFirework && !isSpinning && (
        <Firework
          duration={isLoggedIn ? 1500 : 4000}
          onComplete={() => {
            setShowFirework(false);
          }}
        />
      )}
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background: ${c('neutral.bg')};
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const FixedHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: ${c('neutral.bg')};
`;

const PageContainer = styled.div`
  flex: 1;
  position: fixed;
  background: ${c('neutral.bg')};
  padding: ${s('md')} 16px ${s('xl')} 16px;
  margin-top: ${s('xl')};
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  z-index: 1;
`;

const SearchBarContainer = styled.div`
  padding: ${s('lg')} 0 ${s('lg')} 0;
`;

const SearchBar = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 48px 12px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: ${c('neutral.white')};
  ${typography('body01')};
  color: ${c('neutral.black')};
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: ${c('neutral.gray2')};
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  right: 16px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const SearchIconImg = styled.img`
  width: 20px;
  height: 20px;
`;

const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${s('lg')} 0 ${s('md')} 0;
  margin-top: -${s('xl')};
`;

const Title = styled.h1`
  ${typography('display01')};
  color: ${c('brand.pink')};
  font-weight: 700;
  margin: 0;
`;

const SortContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SortText = styled.span`
  ${typography('body01')};
  color: ${c('neutral.black2')};
`;

const SortArrow = styled.img`
  width: 12px;
  height: 12px;
  color: ${c('neutral.black2')};
`;

const FestivalList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: -${s('xl')};
  gap: ${s('md')};
  padding: ${s('lg')} 0 ${s('md')} 0;
`;

// Welcome 메시지 오버레이
const WelcomeOverlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  padding: ${s('xl')} 16px ${s('xl')} 16px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const WelcomeText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: 40px;
`;

const SlotContainer = styled.div`
  position: relative;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  margin-bottom: 8px;
  overflow: hidden;
  mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 15%,
    black 85%,
    transparent 100%
  );
`;

const SlotItemBox = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: ${c('neutral.white')};
  text-align: center;
  white-space: nowrap;
  font-family: 'Gmarket Sans', sans-serif;
`;

const WelcomeLine = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: ${c('neutral.white')};
  text-align: center;
  line-height: 1.4;
  font-family: 'Gmarket Sans', sans-serif;
  margin-top: 5px;

  .festival-name {
    color: ${c('brand.pink')};
  }
`;
