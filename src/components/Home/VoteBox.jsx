import TitleBar from './TitleBar';
import { BoxContainer } from './BoxContainer';
import voteIcon from '../../assets/icons/HomeVote.svg';
import styled from 'styled-components';
import { c, f, s } from '../../styles/themeUtils';

export default function VoteBox() {
  return (
    <BoxContainer>
      <TitleBar
        imageurl={voteIcon}
        title="앙케이트"
        description="다른 사람들의 생각이 궁금하다면?"
      />
    </BoxContainer>
  );
}
