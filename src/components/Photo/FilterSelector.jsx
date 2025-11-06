import React from 'react';
import styled from 'styled-components';
import { c, typography } from '../../styles/themeUtils';

export default function FilterSelector({ filter, setFilter }) {
  const filters = ['none', 'grayscale', 'sepia', 'bright', 'contrast', 'saturate'];

  return (
    <FilterWrapper>
      {filters.map(f => (
        <FilterButton key={f} $active={filter === f} onClick={() => setFilter(f)}>
          {f}
        </FilterButton>
      ))}
    </FilterWrapper>
  );
}

/* styled-components */

const FilterWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 100px;
  overflow-x: auto;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
`;

const FilterButton = styled.button`
  ${typography('label01')};
  width: 100px;
  height: 100px;
  border: ${({ $active }) => ($active ? 'none' : c('brand.pink'))};
  cursor: pointer;
  color: ${c('neutral.black')};
  background: ${c('neutral.bg')};
  transition:
    background-color 0.2s ease,
    transform 0.1s ease;

  &:active {
    transform: scale(0.96);
  }
`;
