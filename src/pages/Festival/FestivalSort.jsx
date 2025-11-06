import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { c, s, typography } from '../../styles/themeUtils';
import FestivalCheckIcon from '../../assets/icons/FestivalCheck.svg';

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

const SortOptionList = styled.div`
  display: flex;
  flex-direction: column;
`;

const SortOption = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${s('md')} 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  width: 100%;
`;

const SortOptionText = styled.span`
  ${typography('body01')};
  color: ${({ $isSelected }) => 
    $isSelected ? c('brand.pink') : c('neutral.black')};
  transition: color 0.2s ease;
`;

const CheckIcon = styled.img`
  width: 20px;
  height: 20px;
  display: ${({ $isSelected }) => ($isSelected ? 'block' : 'none')};
  filter: ${({ $isSelected }) => 
    $isSelected ? 'brightness(0) saturate(100%) invert(27%) sepia(95%) saturate(7498%) hue-rotate(320deg) brightness(95%) contrast(95%)' : 'none'};
`;

const Separator = styled.div`
  height: 1px;
  background: ${c('neutral.gray')};
  margin: 0;
`;

export default function FestivalSort() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // URL에서 현재 정렬 기준 가져오기 (기본값: 'latest')
  const currentSort = location.state?.sortOrder || localStorage.getItem('festivalSortOrder') || 'latest';
  
  const [selectedSort, setSelectedSort] = useState(currentSort);

  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'alphabetical', label: '가나다순' }
  ];

  const handleSortSelect = (value) => {
    setSelectedSort(value);
    // localStorage에 저장
    localStorage.setItem('festivalSortOrder', value);
    // Festival 페이지로 돌아가기
    navigate('/festival', { state: { sortOrder: value } });
  };

  return (
    <PageContainer>
      <BlurredBackground />
      <BottomSheet>
        <DragHandle />
        <Title>정렬기준</Title>
        <SortOptionList>
          {sortOptions.map((option, index) => (
            <div key={option.value}>
              <SortOption onClick={() => handleSortSelect(option.value)}>
                <SortOptionText $isSelected={selectedSort === option.value}>
                  {option.label}
                </SortOptionText>
                <CheckIcon 
                  src={FestivalCheckIcon} 
                  alt="선택됨" 
                  $isSelected={selectedSort === option.value}
                />
              </SortOption>
              {index < sortOptions.length - 1 && <Separator />}
            </div>
          ))}
        </SortOptionList>
      </BottomSheet>
    </PageContainer>
  );
}

