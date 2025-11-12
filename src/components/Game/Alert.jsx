import { useState } from 'react';
import styled from 'styled-components';
import { c, typography } from '../../styles/themeUtils';
import down from '../../assets/icons/GameArrowDown.svg';

export default function Alert({ icon, title, text, text2, text3, alerttext }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    if (text || text2 || text3) setIsOpen(prev => !prev);
  };

  return (
    <Container>
      <DropdownWrapper onClick={handleToggle}>
        <TitleWrapper>
          {icon && <img src={icon} alt="alert icon" />}
          {title && <Title>{title}</Title>}
          {alerttext && <Content>{alerttext}</Content>}
        </TitleWrapper>

        {(text || text2 || text3) && <Dropdown src={down} $open={isOpen} />}
      </DropdownWrapper>

      {isOpen && (text || text2 || text3) && (
        <ContentWrapper>
          {text && <Content>{text}</Content>}
          {text2 && <Content>{text2}</Content>}
          {text3 && <Content>{text3}</Content>}
        </ContentWrapper>
      )}
    </Container>
  );
}

/* -------------------- styled-components -------------------- */

const Container = styled.div`
  border-radius: 12px;
  width: 100%;
  padding: 10px 16px;
  display: flex;
  gap: 20px;
  flex-direction: column;
  background-color: ${c('neutral.gray')};
`;

const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: 11px;
  flex-direction: row;
  align-items: center;
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
  gap: 10px;
  padding-left: 36px;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Dropdown = styled.img`
  width: 24px;
  height: 24px;
  transition: transform 0.2s ease;
  transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
`;
