import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { c, s, typography } from '../../styles/themeUtils';


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

const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const OptionItem = styled.button`
  width: 100%;
  padding: ${s('lg')} 0;
  background: none;
  border: none;
  border-bottom: 1px solid ${c('neutral.gray')};
  text-align: left;
  ${typography('body01')};
  color: ${c('neutral.black')};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:hover {
    background-color: ${c('neutral.bg')};
  }

  &:active {
    background-color: ${c('neutral.bg')};
  }
`;

export default function ChangeImage() {
  const navigate = useNavigate();

  const handleSelectPhoto = () => {
    // 파일 입력 요소 생성
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // FileReader를 사용하여 이미지를 base64로 변환
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result;
          if (result) {
            // localStorage에 저장
            localStorage.setItem('userProfileImage', result);
            
            // 커스텀 이벤트 발생시켜 MyPage에서 변경사항 감지
            window.dispatchEvent(new Event('profileUpdated'));
            
            // 프로필 페이지로 돌아가기
            navigate('/mypage/profile');
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleSelectDefaultProfile = () => {
    // 기본 프로필 선택 페이지로 이동
    navigate('/mypage/profile/selectimage');
  };



  return (
    <PageContainer>
      <BlurredBackground />
      <BottomSheet>
        <DragHandle />
        <Title>프로필 변경</Title>
        <OptionList>
          <OptionItem onClick={handleSelectPhoto}>
            사진 선택
          </OptionItem>
          <OptionItem onClick={handleSelectDefaultProfile}>
            기본프로필 선택
          </OptionItem>
        </OptionList>
      </BottomSheet>
    </PageContainer>
  );
}

