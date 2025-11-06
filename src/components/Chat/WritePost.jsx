import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { c } from '../../styles/themeUtils';
import ArrowImg from '../../assets/icons/ChatArrow.svg';
import ChatPoll from '../../assets/icons/ChatPoll.svg';
import ChatPollPink from '../../assets/icons/ChatPollPink.svg';
import ChatPhoto from '../../assets/icons/ChatPhoto.svg';
import ChatSend from '../../assets/icons/ChatSend.svg';
import ChatXButtonGray from '../../assets/icons/ChatXButtonGray.svg';
import ChatXButtonBlack from '../../assets/icons/ChatXButtonBlack.svg';

export default function WritePost({ onClose, onAddPost }) {
  const [openCategory, setOpenCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [text, setText] = useState('');
  const [showPoll, setShowPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [images, setImages] = useState([]);

  const categories = ['만남/동행', '정보/공유', '질문/요청', '분실물', '굿즈/이벤트', '기타'];

  const handleSelect = cat => {
    setSelectedCategory(cat);
    setOpenCategory(false);
  };

  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      alert('사진은 최대 3장까지 첨부할 수 있습니다.');
      return;
    }

    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveImage = index => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if (!selectedCategory) {
      alert('카테고리를 선택해주세요!');
      return;
    }

    // 입력값이 모두 비었는지 검사
    if (!text.trim() && images.length === 0 && pollOptions.every(opt => !opt.trim())) {
      return;
    }

    const content = [];

    if (text.trim()) content.push({ type: 'text', data: text });
    if (images.length) content.push({ type: 'images', data: images });
    if (showPoll && pollOptions.some(opt => opt.trim() !== '')) {
      const filled = pollOptions.filter(opt => opt.trim() !== '');
      if (filled.length < 2) {
        alert('투표 항목을 두 개 이상 입력해주세요!');
        return;
      }
      content.push({
        type: 'poll',
        data: { options: filled, votes: new Array(filled.length).fill(0) },
      });
    }

    const newPost = {
      id: Date.now(),
      nickname: '익명의 사용자',
      content,
      like: 0,
      comment: 0,
      time: '방금 전',
      category: selectedCategory,
    };

    onAddPost(newPost);
    onClose();
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

          {/* 글쓰기 */}
          <Textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="어떤 이야기를 하고 싶으신가요?"
          />

          {/* 이미지 미리보기 */}
          {images.length > 0 && (
            <ImagePreviewContainer>
              {images.map((img, i) => (
                <Preview key={i}>
                  <PreviewImg src={img} alt={`preview-${i}`} />
                  <DeletePreviewButton onClick={() => handleRemoveImage(i)}>
                    <img src={ChatXButtonBlack} alt="삭제" />
                  </DeletePreviewButton>
                </Preview>
              ))}
            </ImagePreviewContainer>
          )}

          {/* 투표 입력칸 (아래에 유지) */}
          {showPoll && (
            <PollBox>
              {pollOptions.map((option, index) => (
                <PollItem key={index}>
                  <PollInput
                    type="text"
                    placeholder={`항목 ${index + 1}`}
                    value={option}
                    onChange={e => {
                      const newOptions = [...pollOptions];
                      newOptions[index] = e.target.value;
                      setPollOptions(newOptions);
                    }}
                  />
                  <DeleteButton
                    onClick={() => {
                      if (pollOptions.length <= 2) return;
                      setPollOptions(pollOptions.filter((_, i) => i !== index));
                    }}
                  >
                    <img src={ChatXButtonGray} alt="삭제" />
                  </DeleteButton>
                </PollItem>
              ))}

              {pollOptions.length < 5 && (
                <AddOptionButton onClick={() => setPollOptions([...pollOptions, ''])}>
                  + 항목 추가
                </AddOptionButton>
              )}
            </PollBox>
          )}

          {/* 아이콘 */}
          <IconBox>
            <LeftIcon>
              {/* 투표 아이콘 토글 */}
              <Icon
                src={showPoll ? ChatPollPink : ChatPoll}
                onClick={() => setShowPoll(prev => !prev)}
              />

              {/* 사진 아이콘 */}
              <label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                <Icon src={ChatPhoto} style={{ cursor: 'pointer' }} />
              </label>
            </LeftIcon>
            <RightIcon onClick={handleSend}>
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

const PollBox = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PollInput = styled.input`
  flex: 1;
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: ${c('brand.pink')};
  }
`;

const AddOptionButton = styled.button`
  border: none;
  border: 1px dashed ${c('neutral.gray')};
  //color: ${c('brand.pink')};
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: ${c('brand.pink')};
    color: white;
  }
`;

const PollItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${c('neutral.white')};
  border: 1px solid ${c('neutral.gray')};
  border-radius: 8px;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 20px;
    height: 20px;
    margin: 3px;
  }
`;

const ImagePreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const Preview = styled.div`
  position: relative;
  width: 90px;
  height: 90px;
  border-radius: 8px;
  overflow: hidden;
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DeletePreviewButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: none;
  border: none;
  border-radius: 50%;
  padding: 3px;
  cursor: pointer;

  img {
    width: 20px;
    height: 20px;
    transform: translate(5px, -5px);
  }
`;
