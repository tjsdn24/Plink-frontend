import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { c, typography } from '../../styles/themeUtils';

import axios from 'axios';

import usePhotoEdit from '../../hooks/usePhotoEdit';
import FilterSelector from '../../components/Photo/FilterSelector';
import FrameSelector from '../../components/Photo/FrameSelector';

import { ref, set } from 'firebase/database';
import { db } from '../../hooks/firebase';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PhotoEdit() {
  const location = useLocation();
  const photos = location.state?.photos || [];

  const { canvasRef, filter, setFilter, frameSrc, setFrameSrc, saveMerged, getCanvasFilter } =
    usePhotoEdit(photos);

  const [activeTab, setActiveTab] = useState('frame');
  const [hasSecretFrame, setHasSecretFrame] = useState(false);
  useEffect(() => {
    async function fetchSecret() {
      try {
        const res = await axios.get(`${BASE_URL}/fourcuts/line4thon/secret`);
        // res.data = { hasSecretFrame: true }
        setHasSecretFrame(res.data?.hasSecretFrame || false);
      } catch (e) {
        console.error('Secret frame load error', e);
      }
    }

    fetchSecret();
  }, []);
  /** 최종 저장 핸들러 */
  const handleSave = async () => {
    try {
      // 1) 캔버스 → Blob 변환
      const mergedBlob = await saveMerged();

      const file = new File([mergedBlob], 'fourcut.jpg', { type: 'image/jpeg' });

      // 2) 서버 업로드 (axios + BASE_URL)
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post(`${BASE_URL}/fourcuts/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = res.data; // { imageUrl, qrUrl }

      // 3) Firebase에 QR 저장
      await set(ref(db, 'fourcuts/latest'), {
        qrUrl: data.qrUrl,
        updatedAt: Date.now(),
      });

      alert('저장 완료! 다른 패드에서 QR 업데이트됨 ✔');
    } catch (err) {
      console.error(err);
      alert('업로드 실패!');
    }
  };

  return (
    <Container>
      <PreviewCanvas
        ref={canvasRef}
        width={375}
        height={477}
        style={{
          filter: filter === 'none' ? 'none' : getCanvasFilter(filter),
        }}
      />

      <TabContent>
        {activeTab === 'frame' && (
          <FrameSelector frame={frameSrc} setFrame={setFrameSrc} hasSecretFrame={hasSecretFrame} />
        )}
        {activeTab === 'filter' && <FilterSelector filter={filter} setFilter={setFilter} />}
      </TabContent>

      <TabBar>
        <TabButton $active={activeTab === 'frame'} onClick={() => setActiveTab('frame')}>
          프레임
        </TabButton>
        <TabButton $active={activeTab === 'filter'} onClick={() => setActiveTab('filter')}>
          필터
        </TabButton>
      </TabBar>

      <SaveButton onClick={handleSave}>저장하기</SaveButton>
    </Container>
  );
}

/* styled-components 그대로 유지 */
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
  height: 477px;
  width: 375px;
  background: #111;
  transition: 0.3s ease;
`;

const TabBar = styled.div`
  display: flex;
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
`;
