import styled from 'styled-components';
import { c } from '../../styles/themeUtils';
import { categories } from './Categories';

export default function ChatCatagory({ selectedCategory, onSelectCategory }) {
  return (
    <ChatCatagoryWrapper>
      {categories.map(cat => (
        <CategoryItem
          key={cat.name}
          onClick={() => onSelectCategory(cat.name)} // name 기반 선택
          selected={selectedCategory === cat.name}
        >
          {cat.name}
        </CategoryItem>
      ))}
    </ChatCatagoryWrapper>
  );
}

const ChatCatagoryWrapper = styled.div`
  margin: 0 10px;
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryItem = styled.div`
  flex: 0 0 auto; /* 줄바꿈 방지 */
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
