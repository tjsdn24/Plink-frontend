import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { s } from '../../styles/themeUtils';
import SadEmojiIcon from '../../assets/icons/SadEmoji.svg';
import PageHeader from '../../components/PageHeader';
import SignUpTitle from '../../components/Signup/SignUpTitle';
import TextField from '../../components/Signup/TextField';
import BottomSheet from '../../components/Modal/BottomSheet';
import styled from 'styled-components';

const StyledHeader = styled.div``;

const StyledTitle = styled.div``;

const StyledFields = styled.div`
  padding: 0 ${s('md')};
`;

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: ${s('lg')};
`;

export default function Logout() {
  const navigate = useNavigate();
  
  // localStorage에서 현재 닉네임 가져오기
  const getStoredNickname = () => {
    return localStorage.getItem('userNickname') || '숨쉬는 고양이';
  };
  
  const initialNickname = getStoredNickname();

  const handleLogout = () => {
    // localStorage에서 로그인 상태 제거
    localStorage.removeItem('isLoggedIn');
    
    // 로그아웃 이벤트 발생
    window.dispatchEvent(new Event('storage'));
    
    // 마이페이지로 이동
    navigate('/mypage');
  };

  // 배경 콘텐츠를 메모이제이션하여 불필요한 리렌더링 방지
  const backgroundContent = useMemo(
    () => (
      <>
        <StyledHeader>
          <PageHeader title="마이페이지" />
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
      </>
    ),
    [initialNickname]
  );

  return (
    <BottomSheet
      title="로그아웃"
      emojiIcon={SadEmojiIcon}
      emojiAlt="로그아웃"
      mainMessage="정말 로그아웃 하시겠어요?"
      subMessages={[
        '로그아웃 후 PLINK를',
        '사용하기 위해서는 재로그인이 필요합니다.',
      ]}
      buttonText="로그아웃하기"
      onButtonClick={handleLogout}
      backgroundContent={backgroundContent}
    />
  );
}
