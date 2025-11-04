import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { c } from '../../styles/themeUtils';
import ArrowImg from '../../assets/icons/ChatArrow.svg';
import ChatPoll from '../../assets/icons/ChatPoll.svg';
import ChatPhoto from '../../assets/icons/ChatPhoto.svg';
import ChatSend from '../../assets/icons/ChatSend.svg';

export default function WritePost({ onClose }) {
  const [openCategory, setOpenCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = ['만남/동행', '정보/공유', '질문/요청', '분실물', '기타'];

  const handleSelect = cat => {
    setSelectedCategory(cat);
    setOpenCategory(false);
  };

  return (
    <>
      <Overlay onClick={onClose}>
        <PostContainer onClick={e => e.stopPropagation()}>
          <Header>
            <Title>이야기하기</Title>
            <CloseButton onClick={onClose}>취소</CloseButton>
          </Header>

          <CategoryToggle onClick={() => setOpenCategory(true)}>
            {selectedCategory || '카테고리를 선택해주세요'}
            <Arrow src={ArrowImg} />
          </CategoryToggle>

          <Textarea placeholder="어떤 이야기를 하고 싶으신가요?" />
          <IconBox>
            <LeftIcon>
              <Icon src={ChatPoll} />
              <Icon src={ChatPhoto} />
            </LeftIcon>
            <RightIcon>
              <Icon src={ChatSend} />
            </RightIcon>
          </IconBox>
        </PostContainer>
      </Overlay>

      {/* 카테고리 선택 바텀시트 */}
      {openCategory && (
        <CategorySheet onClick={() => setOpenCategory(false)}>
          <SheetContainer onClick={e => e.stopPropagation()}>
            <SheetHeader>
              <SheetTitle>카테고리</SheetTitle>
              <CloseSheet onClick={() => setOpenCategory(false)}>취소</CloseSheet>
            </SheetHeader>
            {categories.map(cat => (
              <CategoryItem
                key={cat}
                onClick={() => handleSelect(cat)}
                selected={selectedCategory === cat}
              >
                {cat}
              </CategoryItem>
            ))}
          </SheetContainer>
        </CategorySheet>
      )}
    </>
  );
}

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1100;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

const PostContainer = styled.div`
  background: ${c('neutral.bg')};
  width: 100%;
  height: 70%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  animation: ${slideUp} 0.3s ease-out;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
`;

const CloseButton = styled.button`
  background: none;
  color: ${c('sub.yellow')};
  border: none;
  font-size: 15px;
  cursor: pointer;
`;

const Textarea = styled.textarea`
  flex: 1;
  border: 1px solid ${c('neutral.gray')};
  background: ${c('neutral.white')};
  border-radius: 10px;
  padding: 10px;
  font-size: 14px;
  resize: none;
  outline: none;

  &:focus {
    border-color: ${c('brand.pink')};
  }
`;

const IconBox = styled.div`
  height: 30px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
`;

const LeftIcon = styled.div`
  display: flex;
  gap: 20px;
`;
const RightIcon = styled.div``;

const Icon = styled.img`
  width: 25px;
  height: 25px;
`;

const CategoryToggle = styled.div`
  background-color: ${c('neutral.white')};
  border: 1px solid ${c('neutral.gray')};
  border-radius: 8px;
  height: 50px;
  margin: 10px 0 20px 0;
  padding: 15px 20px;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const Arrow = styled.img`
  height: 25px;
  width: 25px;
`;

/* ---- Category Bottom Sheet ---- */
const CategorySheet = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1200;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

const SheetContainer = styled.div`
  background: ${c('neutral.white')};
  width: 100%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 16px;
  animation: ${slideUp} 0.3s ease-out;
`;

const SheetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const SheetTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-left: 10px;
`;

const CloseSheet = styled.button`
  background: none;
  color: ${c('sub.yellow')};
  border: none;
  font-size: 14px;
  cursor: pointer;
`;

const CategoryItem = styled.div`
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  background: ${({ selected }) => (selected ? c('brand.pinkLight') : 'transparent')};
  color: ${({ selected }) => (selected ? c('brand.pink') : 'inherit')};

  &:hover {
    background: ${c('neutral.gray')};
  }
`;
