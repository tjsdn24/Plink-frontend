import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { c, s, typography } from '../../styles/themeUtils';
import avatar1 from '../../assets/icons/profile/avatar1.svg';
import avatar2 from '../../assets/icons/profile/avatar2.svg';
import avatar3 from '../../assets/icons/profile/avatar3.svg';
import avatar4 from '../../assets/icons/profile/avatar4.svg';
import avatar5 from '../../assets/icons/profile/avatar5.svg';
import MyPageCheckIcon from '../../assets/icons/MyPageCheck.svg';

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

const AvatarScrollContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const AvatarList = styled.div`
  display: flex;
  gap: 16px;
  padding: 0 ${s('md')};
  min-width: min-content;
  justify-content: flex-start;
`;

const AvatarItem = styled.button`
  position: relative;
  width: 80px;
  height: 80px;
  min-width: 80px;
  border-radius: 50%;
  border: none;
  background: ${c('neutral.white')};
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ $isSelected }) => 
      $isSelected ? 'rgba(0, 0, 0, 0.6)' : 'transparent'};
    border-radius: 50%;
    z-index: 1;
    transition: background 0.2s ease;
  }
`;

const CheckIcon = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  min-width: 30px;
  min-height: 30px;
  max-width: 30px;
  max-height: 30px;
  object-fit: contain;
  z-index: 2;
  display: ${({ $isSelected }) => ($isSelected ? 'block' : 'none')};
`;

const ButtonContainer = styled.div`
  margin-top: ${s('xl')};
  width: 100%;
`;

const ChangeButton = styled.button`
  width: 100%;
  padding: 20px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: ${c('brand.pink')};
  color: ${c('neutral.white')};
  ${typography('label01')};
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${c('brand.darkPink')};
  }

  &:active {
    background: ${c('brand.darkPink')};
  }
`;

export default function SelectImage() {
  const navigate = useNavigate();
  
  const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5];
  
  // localStorage에서 현재 프로필 이미지 가져오기
  const getCurrentProfileImage = () => {
    return localStorage.getItem('userProfileImage') || avatar1;
  };
  
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    const currentImage = getCurrentProfileImage();
    // 현재 이미지가 기본 아바타 중 하나인지 확인
    const avatarIndex = avatars.findIndex(avatar => {
      // base64로 저장된 경우를 대비해 avatar 파일명으로 비교
      if (typeof currentImage === 'string' && currentImage.startsWith('data:')) {
        return false; // base64 이미지는 기본 아바타가 아님
      }
      return currentImage === avatar || currentImage.includes('avatar1');
    });
    
    // 기본 아바타가 아니면 avatar1을 기본 선택
    return avatarIndex >= 0 ? avatarIndex : 0;
  });

  // 현재 프로필 이미지가 기본 아바타인지 확인
  useEffect(() => {
    const currentImage = getCurrentProfileImage();
    const avatarIndex = avatars.findIndex((avatar, index) => {
      if (typeof currentImage === 'string' && currentImage.startsWith('data:')) {
        return false;
      }
      // localStorage에 저장된 값이 기본 아바타 경로와 일치하는지 확인
      return currentImage === avatar || 
             (index === 0 && currentImage.includes('avatar1'));
    });
    
    if (avatarIndex >= 0) {
      setSelectedAvatar(avatarIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAvatarSelect = (index) => {
    setSelectedAvatar(index);
  };

  const handleChange = () => {
    // 선택한 아바타를 localStorage에 저장
    const selectedAvatarPath = avatars[selectedAvatar];
    localStorage.setItem('userProfileImage', selectedAvatarPath);
    
    // 커스텀 이벤트 발생시켜 MyPage에서 변경사항 감지
    window.dispatchEvent(new Event('profileUpdated'));
    
    // 마이페이지로 이동
    navigate('/mypage');
  };

  return (
    <PageContainer>
      <BlurredBackground />
      <BottomSheet>
        <DragHandle />
        <Title>기본프로필 선택</Title>
        <AvatarScrollContainer>
          <AvatarList>
            {avatars.map((avatar, index) => (
              <AvatarItem
                key={index}
                $isSelected={selectedAvatar === index}
                onClick={() => handleAvatarSelect(index)}
              >
                <img src={avatar} alt={`프로필 ${index + 1}`} />
                <CheckIcon 
                  src={MyPageCheckIcon} 
                  alt="선택됨" 
                  $isSelected={selectedAvatar === index}
                />
              </AvatarItem>
            ))}
          </AvatarList>
        </AvatarScrollContainer>
        <ButtonContainer>
          <ChangeButton onClick={handleChange}>
            변경하기
          </ChangeButton>
        </ButtonContainer>
      </BottomSheet>
    </PageContainer>
  );
}
