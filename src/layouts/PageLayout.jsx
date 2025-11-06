import styled from 'styled-components';
import PageHeader from '../components/PageHeader';

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

export default function PageLayout({ title, children }) {
  const handleBack = () => window.history.back();
  return (
    <Wrapper>
      <FixedHeader>
        <PageHeader title={title} onBack={handleBack} />
      </FixedHeader>
      <Content>{children}</Content>
    </Wrapper>
  );
}
