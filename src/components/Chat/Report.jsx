import styled from 'styled-components';
import { c } from '../../styles/themeUtils';

export default function Report({ onClose }) {
  return (
    <Overlay onClick={onClose}>
      <Sheet onClick={e => e.stopPropagation()}>
        <Handle />
        <h3>신고하기</h3>
        <p>신고 사유를 선택해주세요.</p>
        <button onClick={onClose}>닫기</button>
      </Sheet>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 999;
`;

const Sheet = styled.div`
  width: 100%;
  height: 50%;
  background: ${c('neutral.bg')};
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 20px;
  animation: slideUp 0.3s ease-out;
  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
`;

const Handle = styled.div`
  width: 40px;
  height: 4px;
  background: #ccc;
  border-radius: 2px;
  margin: 0 auto 10px;
`;
