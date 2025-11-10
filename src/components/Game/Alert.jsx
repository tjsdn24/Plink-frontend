import styled from 'styled-components';
import { c, f, s, typography } from '../../styles/themeUtils';
import down from '../../assets/icons/GameArrowDown.svg';
export default function Alert({ icon, title, text, text2, text3, alerttext }) {
  return (
    <Container>
      <DropdownWrapper>
        <TitleWrapper>
          {icon && <img src={icon} alt="alert icon" />} {/* 아이콘 있을 때만 */}
          {title && <Title>{title}</Title>} {/* 제목 있을 때만 */}
          {alerttext && <Content>{alerttext}</Content>} {/* 알럿텍스트 있을 때만 */}
        </TitleWrapper>
        {(text || text2) && <Dropdown src={down} />}
      </DropdownWrapper>
      {(text || text2) /* text가 하나라도 있으면 출력 */ && (
        <ContentWrapper>
          {text && <Content>{text}</Content>}
          {text2 && <Content>{text2}</Content>}
          {text3 && <Content>{text3}</Content>}
        </ContentWrapper>
      )}
    </Container>
  );
}
const Container = styled.div`
  border-radius: 12px;
  width: 100%;
  padding: 10px 16px;
  display: flex;
  gap: 20px;
  flex-direction: column;
  background-color: ${c('neutral.gray')};
`;
const TitleWrapper = styled.div`
  display: flex;
  gap: 11px;
  flex-direction: row;
`;
const Title = styled.h1`
  ${typography('label01')};
`;
const Content = styled.div`
  ${typography('body01')};
`;
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-left: 12px;
`;
const Dropdown = styled.img`
  width: 24px;
  height: 24px;
`;
const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
