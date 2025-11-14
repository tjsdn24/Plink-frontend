import { useRef, useState, useEffect } from 'react';

export default function usePhotoEdit(photos) {
  const canvasRef = useRef(null);
  const [filter, setFilter] = useState('none');
  const [frameSrc, setFrameSrc] = useState(null);

  const CANVAS_W = 375;
  const CANVAS_H = 477;
  const PHOTO_SIZE = 156;

  const getCanvasFilter = f => {
    switch (f) {
      case 'grayscale':
        return 'grayscale(1)';
      case 'sepia':
        return 'sepia(0.6)';
      case 'bright':
        return 'brightness(1.3)';
      case 'contrast':
        return 'contrast(1.4)';
      case 'saturate':
        return 'saturate(1.5)';
      default:
        return 'none';
    }
  };

  /* ---------------- 캔버스 렌더링 ---------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 해상도 보정 (레티나 대응)
    const scale = window.devicePixelRatio || 1;
    canvas.width = CANVAS_W * scale;
    canvas.height = CANVAS_H * scale;
    canvas.style.width = `${CANVAS_W}px`;
    canvas.style.height = `${CANVAS_H}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (!photos.length) return;

    const drawAll = async () => {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.filter = getCanvasFilter(filter);
      // 가로/세로 간격 분리
      const GAP_X = 19; // 가로 간격
      const GAP_Y = 17; // 세로 간격
      const TOP_OFFSET = 72;

      // 전체 가로 너비 = 사진 2개 + 가로 간격
      const totalWidth = PHOTO_SIZE * 2 + GAP_X;

      // 가로 중앙 정렬
      const marginX = (CANVAS_W - totalWidth) / 2;

      // 세로는 TOP_OFFSET 기준
      const marginY = TOP_OFFSET;

      // 4장 그리기
      for (let i = 0; i < photos.length && i < 4; i++) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = photos[i];
        await new Promise(res => (img.onload = res));

        const col = i % 2; // 0 or 1
        const row = Math.floor(i / 2); // 0 or 1

        const x = marginX + col * (PHOTO_SIZE + GAP_X);
        const y = marginY + row * (PHOTO_SIZE + GAP_Y);

        ctx.drawImage(img, x, y, PHOTO_SIZE, PHOTO_SIZE);
      }

      // 프레임
      if (frameSrc) {
        const frame = new Image();
        frame.crossOrigin = 'anonymous';
        frame.src = frameSrc;
        await new Promise(res => (frame.onload = res));

        ctx.globalCompositeOperation = 'destination-over';
        ctx.drawImage(frame, 0, 0, CANVAS_W, CANVAS_H);
        ctx.globalCompositeOperation = 'source-over';
      }
    };

    drawAll();
  }, [photos, filter, frameSrc]);

  /* ---------------- 저장 ---------------- */
  const saveMerged = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'photo_edit.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return {
    canvasRef,
    filter,
    setFilter,
    frameSrc,
    setFrameSrc,
    saveMerged,
    getCanvasFilter,
  };
}
