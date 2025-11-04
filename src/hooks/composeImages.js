export async function composeImages2x2(images) {
  const imgEls = await Promise.all(
    images.map(
      src =>
        new Promise(resolve => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = src;
        })
    )
  );

  const cellWidth = 600;
  const cellHeight = 800; // 3:4 비율
  const gap = 0;
  const cols = 2;
  const rows = 2;
  const totalWidth = cols * cellWidth;
  const totalHeight = rows * cellHeight;

  const canvas = document.createElement('canvas');
  canvas.width = totalWidth;
  canvas.height = totalHeight;
  const ctx = canvas.getContext('2d');

  imgEls.slice(0, 4).forEach((img, i) => {
    const x = (i % cols) * cellWidth;
    const y = Math.floor(i / cols) * cellHeight;
    ctx.drawImage(img, x, y, cellWidth, cellHeight);
  });

  return canvas.toDataURL('image/png');
}
