import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { c, s, typography } from '../../styles/themeUtils';
import FestivalCalenderIcon from '../../assets/icons/FestivalCalender.svg';
import FestivalMapIcon from '../../assets/icons/FestivalMap.svg';

const FestivalCardContainer = styled.div`
  background: ${c('neutral.white')};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${s('md')};
  display: flex;
  gap: ${s('md')};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:active {
    transform: scale(0.98);
  }
`;

const FestivalImage = styled.div`
  width: 90px;
  height: 90px;
  min-width: 90px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${c('neutral.gray')};
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FestivalContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const FestivalHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const DDayLabel = styled.span`
  ${typography('caption01')};
  color: ${c('neutral.gray2')};
  text-transform: uppercase;
  margin-bottom: 4px;
`;

const FestivalName = styled.h2`
  ${typography('headline02')};
  color: ${c('neutral.black')};
  margin: 0;
  margin-bottom: 16px;
  font-weight: 700;
`;

const Hashtags = styled.div`
  ${typography('body02')};
  color: ${c('neutral.black02')};
  margin-bottom: 0;
`;

const FestivalFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
  justify-content: center;
  margin-left: ${s('md')};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  ${typography('body02')};
  color: ${c('neutral.black2')};
  
  img {
    width: 16px;
    height: 16px;
  }
`;

const LocationInfoItem = styled(InfoItem)`
  span {
    margin-left: ${s('xs')};
  }
`;

export default function FestivalCard({ festival, disabled, guestMode = false, guestSlug }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (!disabled) {
      // 환영 페이지를 이미 본 축제인지 확인
      const welcomedFestivals = JSON.parse(localStorage.getItem('welcomedFestivals') || '[]');
      const hasWelcomed = welcomedFestivals.includes(festival.id);
      
      if (hasWelcomed) {
        // 이미 환영 페이지를 본 축제면 바로 홈으로 이동
        navigate('/');
      } else {
        // 처음 보는 축제면 환영 페이지로 이동
        const targetSlug = guestSlug || 'line4thon';
        const welcomeState = guestMode
          ? { festival, guest: true, slug: targetSlug }
          : { festival };
        navigate('/welcome', { state: welcomeState });
      }
    }
  };

  return (
    <FestivalCardContainer 
      onClick={handleCardClick}
      style={{ cursor: disabled ? 'default' : 'pointer', pointerEvents: disabled ? 'none' : 'auto' }}
    >
      <FestivalImage>
        <img src={festival.image} alt={festival.name} />
      </FestivalImage>
      <FestivalContent>
        <FestivalHeader>
          <DDayLabel>{festival.dday}</DDayLabel>
          <FestivalName>{festival.name}</FestivalName>
          <Hashtags>{festival.hashtags}</Hashtags>
        </FestivalHeader>
      </FestivalContent>
      <FestivalFooter>
        <InfoItem>
          <img src={FestivalCalenderIcon} alt="날짜" />
          <span>{festival.date}</span>
        </InfoItem>
        <LocationInfoItem>
          <img src={FestivalMapIcon} alt="위치" />
          <span>{festival.location}</span>
        </LocationInfoItem>
      </FestivalFooter>
    </FestivalCardContainer>
  );
}

