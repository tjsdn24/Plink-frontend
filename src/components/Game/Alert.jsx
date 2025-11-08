import alert from '../../assets/icons/GameAlert.svg';
import styled from 'styled-components';
import { c, f, s, typography } from '../../styles/themeUtils';
export default function Alert() {
  return (
    <>
      <Container>
        <img src={alert} />
        <Content>안녕</Content>
      </Container>
    </>
  );
}
const Container = styled.div`
  border-radius: 12px;
  width: 100%;
  padding: 10px 16px;
  display: flex;
  gap: 11px;
  flex-direction: row;
  background-color: ${c('neutral.gray')};
`;
const Content = styled.div`
  ${typography('body01')};
`;
