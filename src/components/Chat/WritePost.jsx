import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { c } from '../../styles/themeUtils';

import ArrowImg from '../../assets/icons/ChatArrowDown.svg';
import ChatPoll from '../../assets/icons/ChatPoll.svg';
import ChatPollPink from '../../assets/icons/ChatPollPink.svg';
import ChatPhoto from '../../assets/icons/ChatPhoto.svg';
import ChatSend from '../../assets/icons/ChatSend.svg';
import ChatXButtonGray from '../../assets/icons/ChatXButtonGray.svg';
import ChatXButtonBlack from '../../assets/icons/ChatXButtonBlack.svg';

import { createPost } from '../../api/Chat/CommentsApi';
import { canWritePost } from '../../utils/guestSession';

export default function WritePost({ onClose, onAddPost }) {
  const [openCategory, setOpenCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [showPoll, setShowPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);

  const categories = ['만남/동행', '정보/공유', '질문/요청', '분실물', '굿즈/이벤트', '기타'];

  const tagMap = {
    '만남/동행': 1,
    '정보/공유': 2,
    '질문/요청': 3,
    분실물: 4,
    '굿즈/이벤트': 5,
    기타: 6,
  };

  /* --------------------------
        이미지 선택
  --------------------------- */
  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      alert('사진은 최대 3장까지 첨부할 수 있습니다.');
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  const handleRemoveImage = index => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  /* --------------------------
        카테고리 선택
  --------------------------- */
  const handleSelect = cat => {
    setSelectedCategory(cat);
    setOpenCategory(false);
  };

  /* --------------------------
        게시글 전송
  --------------------------- */
  const handleSend = async () => {
    if (!canWritePost()) {
      alert('게시글을 작성하려면 로그인이 필요합니다. 로그인해주세요.');
      return;
    }
    if (!selectedCategory) return alert('카테고리를 선택해주세요.');
    if (!text.trim() && images.length === 0) return alert('내용을 입력해주세요.');

    const tagId = tagMap[selectedCategory];
    if (!tagId) return alert('유효하지 않은 카테고리입니다.');

    const formData = new FormData();
    formData.append('content', text);
    formData.append('tagId', tagId);
    formData.append('postType', showPoll ? 'POLL' : 'NORMAL');

    // 이미지 추가
    images.forEach(file => {
      formData.append('images', file);
    });

    // 투표 옵션 추가
    if (showPoll) {
      const options = pollOptions.filter(opt => opt.trim() !== '');
      if (options.length < 2) {
        alert('투표 항목은 2개 이상 입력해주세요.');
        return;
      }
      options.forEach(opt => formData.append('pollOptions', opt));
    }

    try {
      const res = await createPost('line4thon', formData);
      if (onAddPost) onAddPost(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert('게시글 작성에 실패했습니다.');
    }
  };

  return (
    <>
      {/* 블러 오버레이 */}
      <Overlay onClick={onClose}>
        <PostContainer onClick={e => e.stopPropagation()}>
          {/* 헤더 */}
          <Header>
            <Title>이야기하기</Title>
            <CloseButton onClick={onClose}>취소</CloseButton>
          </Header>

          {/* 카테고리 선택 */}
          <CategoryToggle onClick={() => setOpenCategory(true)}>
            {selectedCategory || '카테고리를 선택해주세요'}
            <Arrow src={ArrowImg} />
          </CategoryToggle>

          {/* 글쓰기 입력 */}
          <Textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="어떤 이야기를 하고 싶으신가요?"
          />

          {/* 이미지 미리보기 */}
          {images.length > 0 && (
            <ImagePreviewContainer>
              {images.map((file, index) => (
                <Preview key={index}>
                  <PreviewImg src={URL.createObjectURL(file)} />
                  <DeletePreviewButton onClick={() => handleRemoveImage(index)}>
                    <img src={ChatXButtonBlack} alt="삭제" />
                  </DeletePreviewButton>
                </Preview>
              ))}
            </ImagePreviewContainer>
          )}

          {/* 투표가 활성화되면 입력 필드 */}
          {showPoll && (
            <PollBox>
              {pollOptions.map((opt, i) => (
                <PollItem key={i}>
                  <PollInput
                    placeholder={`항목 ${i + 1}`}
                    value={opt}
                    onChange={e => {
                      const newOptions = [...pollOptions];
                      newOptions[i] = e.target.value;
                      setPollOptions(newOptions);
                    }}
                  />
                  <DeleteButton
                    onClick={() => {
                      if (pollOptions.length <= 2) return;
                      setPollOptions(pollOptions.filter((_, idx) => idx !== i));
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

          {/* 아이콘 / 전송 */}
          <IconBox>
            <LeftIcon>
              <Icon
                src={showPoll ? ChatPollPink : ChatPoll}
                onClick={() => setShowPoll(prev => !prev)}
              />

              {/* 이미지 업로드 */}
              <label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
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

      {/* 카테고리 바텀시트 */}
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
                selected={selectedCategory === cat}
                onClick={() => handleSelect(cat)}
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

/* ========================= 스타일 ========================= */

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
`;

const CategoryToggle = styled.div`
  background: ${c('neutral.white')};
  border: 1px solid ${c('neutral.gray')};
  border-radius: 8px;
  height: 50px;
  margin: 12px 0 20px;
  padding: 15px 20px;
  font-size: 15px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;

const Arrow = styled.img`
  width: 20px;
  height: 20px;
`;

const Textarea = styled.textarea`
  flex: 1;
  border: 1px solid ${c('neutral.gray')};
  background: ${c('neutral.white')};
  border-radius: 10px;
  padding: 10px;
  resize: none;
  outline: none;
  margin-bottom: 10px;
`;

const IconBox = styled.div`
  height: 40px;
  padding: 10px 5px;
  display: flex;
  justify-content: space-between;
`;

const LeftIcon = styled.div`
  display: flex;
  gap: 20px;
`;

const RightIcon = styled.div`
  cursor: pointer;
`;

const Icon = styled.img`
  width: 26px;
  height: 26px;
`;

const ImagePreviewContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
  flex-wrap: wrap;
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
  cursor: pointer;
  img {
    width: 20px;
    height: 20px;
  }
`;

/* 투표 */
const PollBox = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PollItem = styled.div`
  display: flex;
  align-items: center;
  background: ${c('neutral.white')};
  border: 1px solid ${c('neutral.gray')};
  padding-right: 4px;
  border-radius: 8px;
`;

const PollInput = styled.input`
  flex: 1;
  border: none;
  padding: 10px;
  outline: none;
  border-radius: 8px;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  img {
    width: 18px;
    height: 18px;
  }
`;

const AddOptionButton = styled.button`
  background: none;
  border: 1px dashed ${c('neutral.gray')};
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
`;

/* 카테고리 바텀시트 */
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
`;

const CloseSheet = styled.button`
  background: none;
  border: none;
  color: ${c('sub.yellow')};
`;

const CategoryItem = styled.div`
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  background: ${({ selected }) => (selected ? c('brand.pinkLight') : 'transparent')};
  color: ${({ selected }) => (selected ? c('brand.pink') : 'inherit')};
`;
