import ItemSelector from './ItemSelector';
import frame1 from '../../assets/frames/PossibilityFrame.png';
import frame2 from '../../assets/frames/OrangeFrame.png';
import frame3 from '../../assets/frames/4LineFrame.png';

export default function FrameSelector({ frame, setFrame }) {
  const frames = [frame1, frame2, frame3];

  return <ItemSelector items={frames} selected={frame} onSelect={setFrame} />;
}
