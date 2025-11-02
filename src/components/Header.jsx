import styled from 'styled-components';
import { c, f, s } from '../styles/themeUtils';
import Login from '../pages/Login/Login';
import avatarImg from '../assets/icons/HeaderAvatar.svg';

const Bar = styled.header`
  background: ${c('neutral.bg')};
  padding: ${s('md')};
  font-family: ${f('family.display01')};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const LoginWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
`;
const Logo = styled.h1`
  font-size: 24px;
  color: ${c('brand.pink')};
`;
const LoginButton = styled.button``;

export default function Header() {
  return (
    <Bar>
      <Logo> PLINK</Logo>
      <LoginWrapper>
        <LoginButton>로그인이 필요합니다</LoginButton>

        <img src={avatarImg} alt="아바타 아이콘" />
      </LoginWrapper>
    </Bar>
  );
}
