import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { c, s, typography } from '../../styles/themeUtils';

import styled from 'styled-components';
import usePhotoBooth from '../../hooks/usePhotoBooth';
import VideoView from '../../components/Photo/VideoView';
import PhotoGrid from '../../components/Photo/PhotoGrid';
import CaptureButton from '../../components/Photo/CaptureButton';

export default function PhotoBooth() {
  const navigate = useNavigate();
  const { videoRef, canvasRef, photos, isComplete, takePhoto } = usePhotoBooth();

  // 4장 모두 찍히면 자동으로 편집 페이지로 이동
  useEffect(() => {
    if (isComplete) {
      navigate('/photo/edit', { state: { photos } });
    }
  }, [isComplete, navigate, photos]);

  return (
    <Container>
      <VideoView videoRef={videoRef} canvasRef={canvasRef} />
      <PhotoGrid photos={photos} />
      <GuideText>
        {photos.length < 4 ? `${photos.length + 1}/4번째 사진을 촬영하세요` : '촬영 완료 🎉'}
      </GuideText>
      <CaptureButton onClick={takePhoto} disabled={photos.length >= 4} />
    </Container>
  );
}

/* styled-components */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  background: #000;
  color: #fff;
  width: 100%;
  height: 100vh;
  position: fixed;
`;
const GuideText = styled.div`
  ${typography('label01')};
`;
