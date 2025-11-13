import ItemSelector from './ItemSelector';
import frame1 from '../../assets/frames/normaldevelop.svg';
import frame2 from '../../assets/frames/normalwhite.svg';
import frame3 from '../../assets/frames/normalgradation.svg';
import frame4 from '../../assets/frames/normalorange.svg';

export default function FrameSelector({ frame, setFrame }) {
  const frames = [frame1, frame2, frame3, frame4];

  return <ItemSelector items={frames} selected={frame} onSelect={setFrame} />;
}
