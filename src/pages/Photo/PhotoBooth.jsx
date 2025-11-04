import React, { useState } from 'react';
import { useCamera } from '../../hooks/useCamera';
import { usePhotoBooth } from '../../hooks/usePhotoBooth';
import { composeImages2x2 } from '../../hooks/composeImages';

export default function PhotoBooth() {
  const { videoRef, ready, startCamera, stopCamera } = useCamera();
  const { canvasRef, shots, countdown, countdownAndShoot } = usePhotoBooth(videoRef);
  const [final, setFinal] = useState(null);

  const handleDownload = async () => {
    const result = await composeImages2x2(shots);
    setFinal(result);
    const a = document.createElement('a');
    a.href = result;
    a.download = '2x2-photo.png';
    a.click();
  };

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: '360px',
            aspectRatio: '3 / 4',
            objectFit: 'cover',
            borderRadius: '10px',
            border: '2px solid #ddd',
            marginTop: '1rem',
          }}
        />
        {countdown && (
          <div
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'crimson',
            }}
          >
            {countdown}
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <div style={{ marginTop: '1rem' }}>
          <button onClick={countdownAndShoot}>4장 촬영</button>
          {shots.length === 4 && (
            <button onClick={handleDownload} style={{ marginLeft: '1rem' }}>
              2x2 저장
            </button>
          )}
          <button onClick={stopCamera} style={{ marginLeft: '1rem' }}>
            카메라 끄기
          </button>
        </div>

        {final && (
          <img
            src={final}
            alt="2x2 결과"
            style={{
              marginTop: '1rem',
              width: '400px',
              border: '1px solid #ccc',
            }}
          />
        )}
      </>
    </div>
  );
}
