import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { c, typography } from '../../styles/themeUtils';
import usePhotoEdit from '../../hooks/usePhotoEdit';
import FilterSelector from '../../components/Photo/FilterSelector';

export default function PhotoEdit() {
  const location = useLocation();
  const photos = location.state?.photos || [];
  const { canvasRef, filter, setFilter, saveMerged, getCanvasFilter } = usePhotoEdit(photos);

  return (
    <Container>
      {/* 합성 미리보기 */}
      <PreviewCanvas
        ref={canvasRef}
        width={600}
        height={600}
        style={{
          filter: filter === 'none' ? 'none' : getCanvasFilter(filter),
        }}
      />

      {/* 필터 선택 */}
      <FilterSelector filter={filter} setFilter={setFilter} />

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
  position: fixed;
  text-align: center;
  min-height: 100vh;
  width: 100%;
  color: ${c('neutral.white')};
  background: ${c('neutral.black')};
`;

const PreviewCanvas = styled.canvas`
  height: 425px;
  width: 375px;
  background: #111;
  transition: 0.3s ease;
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
