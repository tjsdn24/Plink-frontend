import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { c, s, typography } from '../../styles/themeUtils';
import Header from '../../components/Header';
import FestivalCard from '../../components/Festival/FestivalCard';
import ChatArrowIcon from '../../assets/icons/ChatArrowDown.svg';
import SearchIcon from '../../assets/icons/SearchIcon.svg';
import FestivalImage from '../../assets/images/4호선톤.webp';

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const FixedHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
`;

const PageContainer = styled.div`
  flex: 1;
  position: fixed;
  background: ${c('neutral.bg')};
  padding: ${s('md')} 16px ${s('xl')} 16px;
  margin-top: ${s('xl')};
  width: 100%;
  box-sizing: border-box;
`;

const SearchBarContainer = styled.div`
  padding: ${s('lg')} 0 ${s('lg')} 0;
`;

const SearchBar = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 48px 12px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: ${c('neutral.white')};
  ${typography('body01')};
  color: ${c('neutral.black')};
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: ${c('neutral.gray2')};
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  right: 16px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const SearchIconImg = styled.img`
  width: 20px;
  height: 20px;
`;

const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${s('lg')} 0 ${s('md')} 0;
  margin-top: -${s('xl')};
`;

const Title = styled.h1`
  ${typography('display01')};
  color: ${c('brand.pink')};
  font-weight: 700;
  margin: 0;
`;

const SortContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`;

const SortText = styled.span`
  ${typography('body01')};
  color: ${c('neutral.black2')};
`;

const SortArrow = styled.img`
  width: 12px;
  height: 12px;
  color: ${c('neutral.black2')};
`;

const FestivalList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: -${s('xl')};
  gap: ${s('md')};
  padding: ${s('lg')} 0 ${s('md')} 0;
`;

export default function Festival() {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState(() => {
    // location state에서 가져오거나 localStorage에서 가져오기
    return location.state?.sortOrder || localStorage.getItem('festivalSortOrder') || 'latest';
  });

  // location state가 변경되면 sortOrder 업데이트
  useEffect(() => {
    if (location.state?.sortOrder) {
      setSortOrder(location.state.sortOrder);
      localStorage.setItem('festivalSortOrder', location.state.sortOrder);
    }
  }, [location.state]);

  // 더미 데이터
  const festivals = [
    {
      id: 1,
      name: '4호선톤',
      hashtags: '#해커톤 #멋사',
      date: '2025.11.15',
      location: '국민대학교',
      image: FestivalImage,
      dday: 'D-DAY',
    },
  ];

  return (
    <PageWrapper>
      <FixedHeader>
        <Header />
      </FixedHeader>
      <PageContainer>
        <SearchBarContainer>
          <SearchBar>
            <SearchInput
              type="text"
              placeholder="원하는 축제를 검색해보세요."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <SearchIconWrapper>
              <SearchIconImg src={SearchIcon} alt="검색" />
            </SearchIconWrapper>
          </SearchBar>
        </SearchBarContainer>

        <TitleSection>
          <Title>축제 명단</Title>
          <SortContainer onClick={() => navigate('/festival/sort', { state: { sortOrder } })}>
            <SortText>{sortOrder === 'latest' ? '최신순' : '가나다순'}</SortText>
            <SortArrow src={ChatArrowIcon} alt="정렬" />
          </SortContainer>
        </TitleSection>

        <FestivalList>
          {festivals.map(festival => (
            <FestivalCard key={festival.id} festival={festival} />
          ))}
        </FestivalList>
      </PageContainer>
    </PageWrapper>
  );
}
