import styled from 'styled-components';
import { c } from '../../styles/themeUtils';

export default function ChatCatagory({ selectedCategory, onSelectCategory }) {
  const categories = [
    '전체',
    '만남/동행',
    '정보/공유',
    '질문/요청',
    '분실물',
    '굿즈/이벤트',
    '기타',
  ];

  return (
    <ChatCatagoryWrapper>
      {categories.map(cat => (
        <CategoryItem
          key={cat}
          onClick={() => onSelectCategory(cat)}
          selected={selectedCategory === cat}
        >
          {cat}
        </CategoryItem>
      ))}
    </ChatCatagoryWrapper>
  );
}

const ChatCatagoryWrapper = styled.div`
  margin: 0px 10px;
  display: flex;
`;

const CategoryItem = styled.div`
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  color: ${({ selected }) => (selected ? c('brand.pink') : 'inherit')};

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.95);
  }
`;
