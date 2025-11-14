import styled from 'styled-components';
import { c } from '../../styles/themeUtils';

export default function ChatCatagory({ selectedCategory, onSelectCategory }) {
  const categories = [
    { name: '전체', id: null },
    { name: '만남/동행', id: 1 },
    { name: '정보/공유', id: 2 },
    { name: '질문/요청', id: 3 },
    { name: '분실물', id: 4 },
    { name: '굿즈/이벤트', id: 5 },
    { name: '기타', id: 6 },
  ];

  return (
    <ChatCatagoryWrapper>
      {categories.map(cat => (
        <CategoryItem
          key={cat.name}
          onClick={() => onSelectCategory(cat.id)} // 숫자 id 전달
          selected={selectedCategory === cat.id}
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
