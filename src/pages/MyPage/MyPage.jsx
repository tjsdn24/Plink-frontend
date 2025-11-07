import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { c, s, typography } from '../../styles/themeUtils';
import defaultAvatar from '../../assets/icons/profile/avatar1.svg';
import LoginPrompt from './LoginPrompt';


const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ $isLoggedIn }) => ($isLoggedIn ? s('sm') : s('lg'))};
  ${({ $isLoggedIn }) =>
    !$isLoggedIn &&
    `
    height: calc(100vh - 120px);
    overflow: visible;
    justify-content: flex-end;
    align-items: flex-start;
    position: relative;
    box-sizing: border-box;
    margin: -16px -16px 0 -16px;
    
    padding-bottom: 0;
  `}
`;

const ProfileCardWrapper = styled.div`
  background: ${c('neutral.white')};
  padding: ${s('xs')} ${s('xl')};
  box-sizing: border-box;
`;

const ProfileCard = styled.div`
  background: ${c('neutral.white')};
  padding: 4px 8px 8px 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  border-radius: ${({ theme }) => theme.radius.md};
  box-sizing: border-box;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
`;

const ProfileImageWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid ${c('neutral.white')};
  position: relative;
  bottom: -12px;
  left: -12px;
`;


const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
  flex: 1;
  align-self: flex-start;
  margin-top: 32px;
  margin-left: -12px;
`;

const UserName = styled.div`
  color: ${c('neutral.black')};
  font-family: 'Pretendard', system-ui, sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -2px;
`;

const Greeting = styled.div`
  color: ${c('neutral.black2')};
  font-family: 'Pretendard', system-ui, sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: normal;
  white-space: nowrap;
  letter-spacing: -2px;
`;

const StatsContainer = styled.div`
  display: flex;
  width: calc(100% + 32px);
  gap: ${s('md')};
  margin-left: calc(-1 * ${s('md')});
  margin-right: calc(-1 * ${s('md')});
  padding: 16px;
  background: ${c('neutral.white')};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${c('brand.pink')};
  margin-top: ${s('md')};
  box-sizing: border-box;
`;

const StatItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const StatNumber = styled.div`
  ${typography('headline02')};
  color: ${c('brand.pink')};
  font-weight: 700;
`;

const StatLabel = styled.div`
  ${typography('caption01')};
  color: ${c('neutral.black2')};
`;

const Section = styled.div`
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
`;

const SectionTitle = styled.div`
  ${typography('headline02')};
  color: ${c('neutral.black')};
  padding: ${s('md')} ${s('xl')} ${s('sm')} ${s('xl')};
  color: var(--color-neutral-black, #1A1D2D);

/* Headline-02 */
font-family: Pretendard;
font-size: 18px;
font-style: normal;
font-weight: 700;
line-height: normal;
`;

const MenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding-top: 0;
`;

const MenuItem = styled.li`
  padding: ${s('md')} ${s('xl')};
  ${typography('body01')};
  color: ${c('neutral.black')};
  cursor: pointer;
  
  &.with-border {
    border-bottom: 1px solid ${c('neutral.gray')};
  }
  
  &:hover {
    background: ${c('neutral.bg')};
  }
`;

const MenuItemLabel = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--color-neutral-black2, #2C3249);

/* Body-01 */
font-family: Pretendard;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: normal;
`;

const MenuItemValue = styled.span`
  ${typography('body02')};
  color: ${c('neutral.black2')};
`;

const ContentWrapper = styled.div`
  position: relative;
  width: 100%;
  ${({ $isLoggedIn }) =>
    !$isLoggedIn &&
    `
    height: 100%;
    overflow: hidden;
    pointer-events: none;
  `}
`;

export default function MyPage({
  isLoggedIn: propIsLoggedIn,
  profileImage: propProfileImage,
  nickname: propNickname,
  storyCount = 7,
  empathyCount = 12,
  commentCount = 36,
}) {
  const navigate = useNavigate();
  
  // localStorage에서 로그인 상태 확인
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (propIsLoggedIn !== undefined) {
      return propIsLoggedIn;
    }
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  // 프로필 데이터 state
  const [userNickname, setUserNickname] = useState(() => {
    if (propNickname !== undefined) {
      return propNickname;
    }
    return localStorage.getItem('userNickname') || '숨쉬는 고양이님!';
  });

  const [userProfileImage, setUserProfileImage] = useState(() => {
    if (propProfileImage !== undefined) {
      return propProfileImage;
    }
    return localStorage.getItem('userProfileImage') || defaultAvatar;
  });

  // 기본 프로필 이미지 (API에서 제공되지 않을 경우)
  const displayProfileImage = userProfileImage || defaultAvatar;

  // 비밀번호 변경 페이지로 이동
  const handleChangePassword = () => {
    navigate('/mypage/changepassword');
  };

  // 프로필 변경 페이지로 이동
  const handleChangeProfile = () => {
    navigate('/mypage/profile');
  };

  const handleOpenMyActivity = path => {
    navigate(path);
  };

  // 로그인 상태 변경 감지
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };

    // 다른 탭에서의 localStorage 변경 감지
    window.addEventListener('storage', handleStorageChange);
    
    // 컴포넌트 마운트 시 및 로그인 후 상태 확인
    const checkLoginStatus = () => {
      const currentStatus = localStorage.getItem('isLoggedIn') === 'true';
      if (currentStatus !== isLoggedIn) {
        setIsLoggedIn(currentStatus);
      }
    };

    // 초기 확인
    checkLoginStatus();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isLoggedIn]);

  // 프로필 업데이트 감지
  useEffect(() => {
    const handleProfileUpdate = () => {
      const storedNickname = localStorage.getItem('userNickname');
      const storedProfileImage = localStorage.getItem('userProfileImage');
      
      if (storedNickname) {
        setUserNickname(storedNickname);
      }
      if (storedProfileImage) {
        setUserProfileImage(storedProfileImage);
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    // 컴포넌트 마운트 시에도 확인
    const storedNickname = localStorage.getItem('userNickname');
    const storedProfileImage = localStorage.getItem('userProfileImage');
    
    if (storedNickname && storedNickname !== userNickname) {
      setUserNickname(storedNickname);
    }
    if (storedProfileImage && storedProfileImage !== userProfileImage) {
      setUserProfileImage(storedProfileImage);
    }

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [userNickname, userProfileImage]);

  // 비로그인 상태에서 스크롤 비활성화
  useEffect(() => {
    if (!isLoggedIn) {
      // MainLayout의 Content 요소 찾기
      const contentElement = document.querySelector('main');
      if (contentElement) {
        const originalOverflow = contentElement.style.overflowY;
        contentElement.style.overflowY = 'hidden';
        
        return () => {
          contentElement.style.overflowY = originalOverflow;
        };
      }
    }
  }, [isLoggedIn]);

  return (
    <>
      <PageContainer $isLoggedIn={isLoggedIn}>
        <ContentWrapper $isLoggedIn={isLoggedIn}>
        <ProfileCardWrapper>
          <ProfileCard>
            <ProfileHeader>
              <ProfileImageWrapper>
                <ProfileImage src={displayProfileImage} alt="프로필" />
              </ProfileImageWrapper>
              <ProfileInfo>
                <UserName>{userNickname}님!</UserName>
                <Greeting>재밌게 즐기고 계신가요?</Greeting>
              </ProfileInfo>
            </ProfileHeader>
            <StatsContainer>
              <StatItem>
                <StatNumber>{storyCount}</StatNumber>
                <StatLabel>이야기</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>{empathyCount}</StatNumber>
                <StatLabel>공감</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>{commentCount}</StatNumber>
                <StatLabel>댓글</StatLabel>
              </StatItem>
            </StatsContainer>
          </ProfileCard>
        </ProfileCardWrapper>

          <Section>
            <SectionTitle>정보수정</SectionTitle>
            <MenuList>
              <MenuItem>
                <MenuItemLabel>
                  아이디
                  <MenuItemValue>abcd1234!</MenuItemValue>
                </MenuItemLabel>
              </MenuItem>
              <MenuItem onClick={handleChangePassword}>
                <MenuItemLabel>비밀번호 변경</MenuItemLabel>
              </MenuItem>
              <MenuItem className="with-border" onClick={handleChangeProfile}>
                <MenuItemLabel>프로필 변경</MenuItemLabel>
              </MenuItem>
            </MenuList>
          </Section>

          <Section>
            <SectionTitle>내 활동 보기</SectionTitle>
            <MenuList>
              <MenuItem onClick={() => handleOpenMyActivity('/mypage/chat')}>
                <MenuItemLabel>내가 쓴 이야기</MenuItemLabel>
              </MenuItem>
              <MenuItem onClick={() => handleOpenMyActivity('/mypage/like')}>
                <MenuItemLabel>내가 공감한 이야기</MenuItemLabel>
              </MenuItem>
              <MenuItem className="with-border" onClick={() => handleOpenMyActivity('/mypage/comment')}>
                <MenuItemLabel>내가 댓글단 이야기</MenuItemLabel>
              </MenuItem>
            </MenuList>
          </Section>

          <Section>
            <SectionTitle>계정관리</SectionTitle>
            <MenuList>
              <MenuItem onClick={() => navigate('/mypage/logout')}>
                <MenuItemLabel>로그아웃</MenuItemLabel>
              </MenuItem>
              <MenuItem>
                <MenuItemLabel>계정탈퇴</MenuItemLabel>
              </MenuItem>
            </MenuList>
          </Section>
        </ContentWrapper>
        
        {!isLoggedIn && <LoginPrompt />}
      </PageContainer>
    </>
  );
}
