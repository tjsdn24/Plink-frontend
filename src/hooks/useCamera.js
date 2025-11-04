import { useRef, useState } from 'react';

export function useCamera() {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [stream, setStream] = useState(null);

  const startCamera = async () => {
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1080 },
          height: { ideal: 1440 }, // 3:4 비율
          aspectRatio: 3 / 4,
        },
        audio: false,
      });
      setStream(media);
      if (videoRef.current) {
        videoRef.current.srcObject = media;
        await videoRef.current.play();
        setReady(true);
      }
    } catch (err) {
      alert('카메라 접근 실패 (권한 및 HTTPS 확인 필요)');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setReady(false);
    }
  };

  return { videoRef, ready, startCamera, stopCamera };
}
