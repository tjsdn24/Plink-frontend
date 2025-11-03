import styled from 'styled-components';
import { c, f, s } from '../../styles/themeUtils';

import InfoBar from '../../components/Home/InfoBar';

const HomeContainer = styled.div`
  padding-top: ${s('md')};
`;

export default function Home() {
  return (
    <HomeContainer>
      <InfoBar />
    </HomeContainer>
  );
}
