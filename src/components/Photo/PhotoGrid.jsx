import React from 'react';
import styled from 'styled-components';
import { c, typography } from '../../styles/themeUtils';

export default function PhotoGrid({ photos, max = 4 }) {
  return (
    <Grid columns={max}>
      {Array.from({ length: max }).map((_, i) => (
        <Cell key={i}>
          {photos[i] ? (
            <Img src={photos[i]} alt={`photo-${i}`} />
          ) : (
            <Placeholder>{i + 1}</Placeholder>
          )}
        </Cell>
      ))}
    </Grid>
  );
}

/* styled-components */

const Grid = styled.div`
  display: grid;
  grid-template-columns: ${({ columns }) => `repeat(${columns}, 1fr)`};
  gap: 8px;
  margin-top: 12px;
`;

const Cell = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 8px;
  border: 2px solid ${c('neutral.white')};
  overflow: hidden;
  background: ${c('neutral.bg')};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Placeholder = styled.div`
  color: ${c('neutral.black')};
  font-size: 12px;
`;
