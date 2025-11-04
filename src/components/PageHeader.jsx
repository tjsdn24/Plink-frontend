import styled from 'styled-components';
import { c, f, s } from '../styles/themeUtils';
import leftarrowImg from '../assets/icons/leftarrow.svg';

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

export default function PageHeader({ title = '회원가입' }) {
  return (
    <Bar>
      <Logo>
        <img src={leftarrowImg} alt="왼쪽 화살표" />
        {title}
      </Logo>
    </Bar>
  );
}
