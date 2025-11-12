import React, { useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { c, typography } from '../../styles/themeUtils';
import usePhotoEdit from '../../hooks/usePhotoEdit';
import FilterSelector from '../../components/Photo/FilterSelector';
import FrameSelector from '../../components/Photo/FrameSelector';
import StickerSelector from '../../components/Photo/StickerSelector';

export default function PhotoEdit() {
  const location = useLocation();
  const photos = location.state?.photos || [];
  const {
    canvasRef,
    filter,
    setFilter,
    frameSrc,
    setFrameSrc,
    addSticker,
    saveMerged,
    getCanvasFilter,
  } = usePhotoEdit(photos);

  const [activeTab, setActiveTab] = useState('frame');

  return (
    <Container>
      {/* 미리보기 */}
      <PreviewCanvas
        ref={canvasRef}
        width={375}
        height={420}
        style={{
          width: '375px',
          height: '420px',
          filter: filter === 'none' ? 'none' : getCanvasFilter(filter),
        }}
      />

      {/* 선택된 탭 내용 */}
      <TabContent>
        {activeTab === 'frame' && <FrameSelector frame={frameSrc} setFrame={setFrameSrc} />}
        {activeTab === 'filter' && <FilterSelector filter={filter} setFilter={setFilter} />}
        {activeTab === 'sticker' && <StickerSelector addSticker={addSticker} />}
      </TabContent>
      {/* 탭 메뉴 */}
      <TabBar>
        <TabButton $active={activeTab === 'sticker'} onClick={() => setActiveTab('sticker')}>
          스티커
        </TabButton>
        <TabButton $active={activeTab === 'frame'} onClick={() => setActiveTab('frame')}>
          프레임
        </TabButton>
        <TabButton $active={activeTab === 'filter'} onClick={() => setActiveTab('filter')}>
          필터
        </TabButton>
      </TabBar>
      {/* 저장 버튼 */}
      <SaveButton onClick={saveMerged}>저장하기</SaveButton>
    </Container>
  );
}

/* styled-components */

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;
  gap: 16px;
  min-height: 100vh;
  width: 100%;
  color: ${c('neutral.white')};
  background: ${c('neutral.black')};
`;

const PreviewCanvas = styled.canvas`
  height: 425px;
  width: 375px;
  background: #111;
  border-radius: 12px;
  transition: 0.3s ease;
`;

/* 🔥 탭 스타일 */
const TabBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 8px;
`;

const TabButton = styled.button`
  ${typography('label01')};
  color: ${({ $active }) => ($active ? c('brand.pink') : c('neutral.gray'))};
  background: transparent;
  border: none;
  border-bottom: ${({ $active }) =>
    $active ? `2px solid ${c('brand.pink')}` : '2px solid transparent'};
  padding: 6px 12px;
  cursor: pointer;
  transition: 0.2s ease;
  &:hover {
    color: ${c('brand.pink')};
  }
`;

const TabContent = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const SaveButton = styled.button`
  ${typography('body01')};
  color: ${c('brand.pink')};
  border: none;
  border-radius: 12px;
  padding: 10px 24px;
  cursor: pointer;
  margin-top: 12px;
  transition: transform 0.1s ease;
  &:active {
    transform: scale(0.97);
  }
`;
