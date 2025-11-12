import ItemSelector from './ItemSelector';
import sticker1 from '../../assets/stickers/dongguk.svg';
import sticker2 from '../../assets/stickers/dongguk.svg';
import sticker3 from '../../assets/stickers/dongguk.svg';

export default function StickerSelector({ addSticker }) {
  const stickers = [sticker1, sticker2, sticker3];

  return (
    <ItemSelector
      items={stickers}
      selected={null} // 선택 개념이 없으면 null
      onSelect={addSticker}
    />
  );
}
