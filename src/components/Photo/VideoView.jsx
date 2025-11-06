import React from 'react';
import styled from 'styled-components';
import { c, typography } from '../../styles/themeUtils';

export default function VideoView({ videoRef, canvasRef }) {
  return (
    <Wrapper>
      <Video ref={videoRef} autoPlay playsInline />
      <HiddenCanvas ref={canvasRef} />
    </Wrapper>
  );
}

/* styled-components */

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Video = styled.video`
  width: 100%;
  aspect-ratio: 1 / 1; /* 정방형 유지 */
  background: ${c('neutral.gray')};
  transform: scaleX(-1); /* 셀카 좌우 반전 */
  object-fit: cover;
`;

const HiddenCanvas = styled.canvas`
  display: none;
`;
