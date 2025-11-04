import { useRef, useState } from 'react';

export function usePhotoBooth(videoRef) {
  const canvasRef = useRef(null);
  const [shots, setShots] = useState([]);
  const [countdown, setCountdown] = useState(null);

  const takeShot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const w = 900;
    const h = 1200; // 3:4 비율
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);
    return canvas.toDataURL('image/png');
  };

  const countdownAndShoot = async (count = 3, total = 4) => {
    const photos = [];
    for (let i = 0; i < total; i++) {
      await runCountdown(count);
      const shot = takeShot();
      if (shot) photos.push(shot);
      await delay(800);
    }
    setShots(photos);
  };

  const runCountdown = sec =>
    new Promise(resolve => {
      let n = sec;
      setCountdown(n);
      const timer = setInterval(() => {
        n -= 1;
        setCountdown(n);
        if (n <= 0) {
          clearInterval(timer);
          setCountdown(null);
          resolve();
        }
      }, 1000);
    });

  const delay = ms => new Promise(r => setTimeout(r, ms));

  return { canvasRef, shots, countdown, countdownAndShoot };
}
