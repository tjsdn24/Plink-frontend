import React from 'react';
import styled from 'styled-components';

export default function ItemSelector({ items, selected, onSelect, renderItem, itemSize = 100 }) {
  const isImage = value =>
    typeof value === 'string' &&
    (value.endsWith('.png') ||
      value.endsWith('.jpg') ||
      value.endsWith('.jpeg') ||
      value.endsWith('.svg') ||
      value.startsWith('data:image'));

  return (
    <ScrollWrapper $size={itemSize}>
      <Inner>
        {items.map((item, i) => (
          <ItemButton
            key={i}
            $active={selected === item}
            $size={itemSize}
            onClick={() => onSelect(item)}
          >
            {renderItem ? (
              renderItem(item)
            ) : isImage(item) ? (
              <img src={item} alt={`item-${i}`} />
            ) : (
              <span>{item}</span>
            )}
          </ItemButton>
        ))}
      </Inner>
    </ScrollWrapper>
  );
}

const ScrollWrapper = styled.div`
  width: ${({ $size }) => $size * 3.5 + 24}px; /* 버튼 3개 반 보이게 */
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 6px;
  margin-top: 12px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  /* 스크롤바 디자인 최소화 (선택사항) */
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 4px;
  }
`;

const Inner = styled.div`
  display: flex;
  gap: 8px;
  padding-right: 16px;
`;

const ItemButton = styled.button`
  flex: 0 0 auto;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border: ${({ $active }) => ($active ? '2px solid #ff5fa2' : '1px solid #555')};
  border-radius: 8px;
  overflow: hidden;
  background: #222;
  cursor: pointer;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: start;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  span {
    font-size: 14px;
    text-transform: capitalize;
  }
`;
