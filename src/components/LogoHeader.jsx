import styled from 'styled-components';
import { c, f, s } from '../styles/themeUtils';
import MainLogo from '../assets/icons/MainLogo.svg';

const Bar = styled.header`
  height: 100px;
  background: ${c('neutral.bg')};
  padding: ${s('md')};
  font-family: ${f('family.display01')};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const LogoImage = styled.img`
  height: 100%;
`;

export default function Header() {
  return (
    <Bar>
      <LogoImage src={MainLogo} alt="PLINK 로고" />
    </Bar>
  );
}
