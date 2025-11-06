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
  font-weight: ${f('weight.bold')};
  color: ${c('brand.pink')};
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: ${f('family.display01')};
  font-size: 20px;
  font-weight: ${f('weight.bold')};
  color: ${c('brand.pink')};

  img {
    pointer-events: none;
  }
`;

const ArrowImg = styled.img`
  pointer-events: none;
`;

export default function PageHeader({ title = '회원가입', onBack }) {
  const content = (
    <>
      <ArrowImg src={leftarrowImg} alt="왼쪽 화살표" />
      {title}
    </>
  );

  return (
    <Bar>
      {onBack ? <BackButton onClick={onBack}>{content}</BackButton> : <Logo>{content}</Logo>}
    </Bar>
  );
}
