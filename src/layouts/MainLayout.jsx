import styled from 'styled-components';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative; /* 네브바 위치 기준 확보 */
  overflow-x: hidden;
`;

const Content = styled.main`
  flex: 1;
  /* padding: 16px; */
  background-color: ${({ theme }) => theme.colors.gray100};
  padding-top: 60px; /* ✅ 헤더 높이만큼 띄우기 */
  padding-bottom: 60px; /* ✅ 네브바 높이만큼 띄우기 */
  overflow-y: auto;
`;

const FixedHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
`;

const FixedNavbar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
`;

export default function MainLayout({ children }) {
  return (
    <Wrapper>
      <FixedHeader>
        <Header />
      </FixedHeader>

      <Content>{children}</Content>

      <FixedNavbar>
        <Navbar />
      </FixedNavbar>
    </Wrapper>
  );
}
