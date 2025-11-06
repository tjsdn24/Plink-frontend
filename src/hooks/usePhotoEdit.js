import { useEffect, useRef, useState } from 'react';

export default function usePhotoEdit(photos) {
  const canvasRef = useRef(null);
  const [mergedImg, setMergedImg] = useState(null);
  const [filter, setFilter] = useState('none');

  // ✅ 네컷 합성 (2x2)
  useEffect(() => {
    if (!photos || photos.length < 4) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = 300;
    const rows = 2;
    const cols = 2;

    canvas.width = size * cols;
    canvas.height = size * rows;

    const imgs = photos.map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });

    let loadedCount = 0;
    imgs.forEach((img, i) => {
      img.onload = () => {
        const x = (i % cols) * size;
        const y = Math.floor(i / cols) * size;
        ctx.drawImage(img, x, y, size, size);
        loadedCount++;
        if (loadedCount === imgs.length) {
          setMergedImg(canvas.toDataURL('image/png'));
        }
      };
    });
  }, [photos]);

  // ✅ 필터 적용
  useEffect(() => {
    if (!mergedImg) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = mergedImg;
    img.onload = () => {
      ctx.filter = getCanvasFilter(filter);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, [filter, mergedImg]);

  // ✅ 필터 정의
  const getCanvasFilter = filterName => {
    switch (filterName) {
      case 'grayscale':
        return 'grayscale(1)';
      case 'sepia':
        return 'sepia(1)';
      case 'bright':
        return 'brightness(1.3)';
      case 'contrast':
        return 'contrast(1.5)';
      case 'saturate':
        return 'saturate(1.5)';
      default:
        return 'none';
    }
  };

  // 저장
  const saveMerged = () => {
    const link = document.createElement('a');
    link.download = 'photobooth_merged.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return {
    canvasRef,
    mergedImg,
    filter,
    setFilter,
    saveMerged,
    getCanvasFilter,
  };
}
