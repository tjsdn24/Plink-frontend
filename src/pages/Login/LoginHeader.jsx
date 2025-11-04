import styled from 'styled-components';
import { c, f, s } from '../../styles/themeUtils';

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
  font-size: 20px;
  color: ${c('brand.pink')};
  display: flex;
  align-items: center;
  gap: 12px;
`;

export default function LoginHeader() {
  return (
    <Bar>
      <Logo>로그인</Logo>
    </Bar>
  );
}
