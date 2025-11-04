import styled from 'styled-components';
import { c, f, s } from '../../styles/themeUtils';
import avatarImg from '../../assets/icons/HeaderAvatar.svg';

const Bar = styled.header`
  height: 60px;
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

export default function LoginHeader() {
  return (
    <Bar>
      <Logo> 로그인</Logo>
      <LoginWrapper>
        <img src={avatarImg} alt="아바타 아이콘" />
      </LoginWrapper>
    </Bar>
  );
}


