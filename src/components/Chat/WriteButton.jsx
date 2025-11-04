import styled from 'styled-components';
import WriteIcon from '../../assets/icons/ChatWrite.svg';
import { c } from '../../styles/themeUtils';

export default function WriteButton({ onClick }) {
  return (
    <WriteButtonWrapper onClick={onClick}>
      <WriteImg src={WriteIcon} alt="글쓰기 아이콘" />
    </WriteButtonWrapper>
  );
}

const WriteButtonWrapper = styled.button`
  position: fixed;
  bottom: 80px;
  right: 30px;
  background-color: ${c('brand.pink')};
  border: none;
  border-radius: 16px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const WriteImg = styled.img`
  width: 25px;
  height: 25px;
`;
