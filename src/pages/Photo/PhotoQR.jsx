import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../hooks/firebase';
import styled from 'styled-components';

export default function PhotoQR() {
  const [qrUrl, setQrUrl] = useState(null);

  useEffect(() => {
    // Firebase 실시간 구독
    const qrRef = ref(db, 'fourcuts/latest');

    onValue(qrRef, snapshot => {
      const data = snapshot.val();
      if (data?.qrUrl) {
        setQrUrl(data.qrUrl);
      }
    });
  }, []);

  return (
    <Wrapper>
      <Title>QR CODE</Title>
      {qrUrl ? <QRImage src={qrUrl} alt="QR Code" /> : <Loading>QR 대기 중...</Loading>}
    </Wrapper>
  );
}

/* 스타일링 */
const Wrapper = styled.div`
  padding-top: 60px;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 24px;
`;

const QRImage = styled.img`
  width: 300px;
  height: 300px;
`;

const Loading = styled.p`
  color: #999;
`;
