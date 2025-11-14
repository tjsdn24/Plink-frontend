import ItemSelector from './ItemSelector';
import frame1 from '../../assets/frames/frame1.svg';
import frame2 from '../../assets/frames/frame2.svg';
import frame3 from '../../assets/frames/frame3.svg';
import frame4 from '../../assets/frames/frame4.svg';
import frame5 from '../../assets/frames/frame5.svg';
import frame6 from '../../assets/frames/frame6.svg';
import frame7 from '../../assets/frames/frame7.svg';
export default function FrameSelector({ frame, setFrame, hasSecretFrame }) {
  const frames = [
    frame1,
    hasSecretFrame ? frame2 : null, // 해금됐을 때만 추가
    frame3,
    frame4,
    frame5,
    frame6,
    frame7,
  ].filter(Boolean); // null 제거

  return <ItemSelector items={frames} selected={frame} onSelect={setFrame} />;
}
