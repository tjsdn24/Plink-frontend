import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { c } from '../../styles/themeUtils';
import { categories } from './Categories';

import ArrowImg from '../../assets/icons/ChatArrowDown.svg';
import ChatPoll from '../../assets/icons/ChatPoll.svg';
import ChatPollPink from '../../assets/icons/ChatPollPink.svg';
import ChatPhoto from '../../assets/icons/ChatPhoto.svg';
import ChatSend from '../../assets/icons/ChatSend.svg';
import ChatXButtonGray from '../../assets/icons/ChatXButtonGray.svg';
import ChatXButtonBlack from '../../assets/icons/ChatXButtonBlack.svg';

import { createPost } from '../../api/Chat/CommentsApi';

export default function WritePost({ onClose, onAddPost }) {
  const [openCategory, setOpenCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(''); // 문자열만 저장
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [showPoll, setShowPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [title, setTitle] = useState('');

  const tagIdMap = Object.fromEntries(categories.map(cat => [cat.name, cat.tagId]));
  const tagId = tagIdMap[selectedCategory];

  /* 이미지 선택 */
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

  /* 카테고리 선택 */
  const handleSelect = catName => {
    setSelectedCategory(catName);
    setOpenCategory(false);
  };

  /* 게시글 전송 */
  const handleSend = async () => {
    if (!selectedCategory) return alert('카테고리를 선택해주세요.');

    const formData = new FormData();

    if (showPoll) {
      if (!title.trim()) return alert('투표 제목을 입력해주세요.');

      formData.append('title', title);
      formData.append('postType', 'POLL');
      formData.append('tagId', tagId);

      const options = pollOptions.filter(o => o.trim() !== '');
      if (options.length < 2) return alert('투표 항목은 2개 이상 입력해주세요.');

      options.forEach((opt, idx) => {
        formData.append(`poll.option[${idx}]`, opt);
      });
    } else {
      if (!text.trim() && images.length === 0) {
        return alert('내용을 입력해주세요.');
      }

      formData.append('title', text.slice(0, 20) || '');
      formData.append('content', text);
      formData.append('postType', 'NORMAL');
    }

    formData.append('tagId', tagId);

    images.forEach(img => {
      formData.append('images', img);
    });

    try {
      const res = await createPost('line4thon', formData);
      onAddPost?.(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert('게시글 작성에 실패했습니다.');
    }
  };

  return (
    <>
      <Overlay onClick={onClose}>
        <PostContainer onClick={e => e.stopPropagation()}>
          <Header>
            <TitleHeader>이야기하기</TitleHeader>
            <CloseButton onClick={onClose}>취소</CloseButton>
          </Header>

          <CategoryToggle onClick={() => setOpenCategory(true)}>
            {selectedCategory || '카테고리를 선택해주세요'}
            <Arrow src={ArrowImg} />
          </CategoryToggle>

          {!showPoll && (
            <Textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="어떤 이야기를 하고 싶으신가요?"
            />
          )}

          {showPoll && (
            <TitleInput
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="투표 제목을 입력해주세요"
            />
          )}

          {images.length > 0 && (
            <ImagePreviewContainer>
              {images.map((file, idx) => (
                <Preview key={idx}>
                  <PreviewImg src={URL.createObjectURL(file)} />
                  <DeletePreviewButton onClick={() => handleRemoveImage(idx)}>
                    <img src={ChatXButtonBlack} alt="삭제" />
                  </DeletePreviewButton>
                </Preview>
              ))}
            </ImagePreviewContainer>
          )}

          {showPoll && (
            <PollBox>
              {pollOptions.map((opt, i) => (
                <PollItem key={i}>
                  <PollInput
                    placeholder={`항목 ${i + 1}`}
                    value={opt}
                    onChange={e => {
                      const newList = [...pollOptions];
                      newList[i] = e.target.value;
                      setPollOptions(newList);
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

          <IconBox>
            <LeftIcon>
              <Icon
                src={showPoll ? ChatPollPink : ChatPoll}
                onClick={() => setShowPoll(prev => !prev)}
              />

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

      {openCategory && (
        <CategorySheet onClick={() => setOpenCategory(false)}>
          <SheetContainer onClick={e => e.stopPropagation()}>
            <SheetHeader>
              <SheetTitle>카테고리</SheetTitle>
              <CloseSheet onClick={() => setOpenCategory(false)}>취소</CloseSheet>
            </SheetHeader>

            {categories.map(cat => (
              <CategoryItem
                key={cat.tagId ?? 'all'} // 고유 key
                selected={selectedCategory === cat.name}
                onClick={() => handleSelect(cat.name)}
              >
                {cat.name}
              </CategoryItem>
            ))}
          </SheetContainer>
        </CategorySheet>
      )}
    </>
  );
}

/* ========== 스타일 ========== */

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1100;
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
`;

const TitleHeader = styled.h2`
  font-size: 18px;
  font-weight: bold;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${c('sub.yellow')};
`;

const CategoryToggle = styled.div`
  background: ${c('neutral.white')};
  border: 1px solid ${c('neutral.gray')};
  padding: 15px 20px;
  height: 50px;
  margin: 12px 0 20px;
  display: flex;
  justify-content: space-between;
  border-radius: 8px;
  cursor: pointer;
`;

const Arrow = styled.img`
  width: 20px;
`;

const Textarea = styled.textarea`
  flex: 1;
  border: 1px solid ${c('neutral.gray')};
  background: ${c('neutral.white')};
  padding: 10px;
  border-radius: 8px;
  resize: none;
  margin-bottom: 10px;
`;

const TitleInput = styled.input`
  width: 100%;
  border: 1px solid ${c('neutral.gray')};
  padding: 12px;
  margin-bottom: 12px;
  background: ${c('neutral.white')};
  border-radius: 8px;
`;

const IconBox = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 5px;
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
`;

const ImagePreviewContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 8px;
`;

const Preview = styled.div`
  position: relative;
  width: 90px;
  height: 90px;
  overflow: hidden;
  border-radius: 8px;
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
`;

const PollBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PollItem = styled.div`
  display: flex;
  background: ${c('neutral.white')};
  border: 1px solid ${c('neutral.gray')};
  border-radius: 8px;
  padding-right: 4px;
`;

const PollInput = styled.input`
  flex: 1;
  border: none;
  padding: 10px;
  border-radius: 8px;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
`;

const AddOptionButton = styled.button`
  background: none;
  border: 1px dashed ${c('neutral.gray')};
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
`;

const CategorySheet = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1200;
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
`;

const SheetTitle = styled.h3`
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
