import styled from 'styled-components';
import { c, f, s } from '../styles/themeUtils';


const Bar = styled.header`
  height: 60px;
  background: ${c('neutral.bg')};
  padding: ${s('md')};
  font-family: ${f('family.display01')};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Logo = styled.h1`
  font-size: 24px;
  color: ${c('brand.black')};
`;


export default function Header() {
  return (
    <Bar>
      <Logo> PLINK</Logo>
    </Bar>
  );
}
