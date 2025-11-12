import { useRef, useState, useEffect } from 'react';

export default function usePhotoEdit(photos) {
  const canvasRef = useRef(null);
  const [filter, setFilter] = useState('none');
  const [frameSrc, setFrameSrc] = useState(null);
  const [stickers, setStickers] = useState([]); // {id, src, x, y, scale, isSelected}

  const CANVAS_W = 375;
  const CANVAS_H = 420;
  const PHOTO_SIZE = 160;

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

      // 기본 사진 (2x2, 15px 간격)
      const gap = 15;
      const marginX = (CANVAS_W - (PHOTO_SIZE * 2 + gap)) / 2; // 20px
      const marginY = (CANVAS_H - (PHOTO_SIZE * 2 + gap)) / 2; // 중앙 정렬용

      for (let i = 0; i < photos.length; i++) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = photos[i];
        await new Promise(res => (img.onload = res));

        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = marginX + col * (PHOTO_SIZE + gap);
        const y = marginY + row * (PHOTO_SIZE + gap);
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

      // 스티커
      for (const s of stickers) {
        const sticker = new Image();
        sticker.crossOrigin = 'anonymous';
        sticker.src = s.src;
        await new Promise(res => (sticker.onload = res));
        const size = 100 * s.scale;
        ctx.drawImage(sticker, s.x, s.y, size, size);

        if (s.isSelected) {
          ctx.strokeStyle = '#ff5fa2';
          ctx.lineWidth = 2;
          ctx.strokeRect(s.x - 2, s.y - 2, size + 4, size + 4);
        }
      }
    };

    drawAll();
  }, [photos, filter, frameSrc, stickers]);

  /* ---------------- 스티커 조작 ---------------- */
  const addSticker = src => {
    setStickers(prev => [
      ...prev,
      { id: Date.now(), src, x: 200, y: 300, scale: 1, isSelected: false },
    ]);
  };

  const selectSticker = (x, y) => {
    setStickers(prev =>
      prev.map(s => {
        const size = 100 * s.scale;
        const clicked = x >= s.x && x <= s.x + size && y >= s.y && y <= s.y + size;
        return { ...s, isSelected: clicked };
      })
    );
  };

  const moveSticker = (dx, dy) => {
    setStickers(prev => prev.map(s => (s.isSelected ? { ...s, x: s.x + dx, y: s.y + dy } : s)));
  };

  const scaleSticker = delta => {
    setStickers(prev =>
      prev.map(s => (s.isSelected ? { ...s, scale: Math.max(0.3, s.scale + delta * 0.01) } : s))
    );
  };

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
    stickers,
    addSticker,
    saveMerged,
    getCanvasFilter,
    selectSticker,
    moveSticker,
    scaleSticker,
  };
}
