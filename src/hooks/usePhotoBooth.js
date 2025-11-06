import { useEffect, useRef, useState } from 'react';

export default function usePhotoBooth() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  // 카메라 연결
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(err => console.error('카메라 접근 실패:', err));

    return () => {
      const stream = videoRef.current?.srcObject;
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  // 사진 촬영
  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.warn('비디오 준비 중입니다.');
      return;
    }

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 좌우 반전
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    //정방형 자르기
    const minSize = Math.min(video.videoWidth, video.videoHeight);
    const sx = (video.videoWidth - minSize) / 2;
    const sy = (video.videoHeight - minSize) / 2;

    canvas.width = minSize;
    canvas.height = minSize;

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, minSize, minSize, 0, 0, canvas.width, canvas.height);

    const imageUrl = canvas.toDataURL('image/png');
    const updated = [...photos, imageUrl];
    setPhotos(updated);
    if (updated.length === 4) setIsComplete(true);
  };

  return { videoRef, canvasRef, photos, isComplete, takePhoto };
}
