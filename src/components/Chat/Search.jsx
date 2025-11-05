import styled from 'styled-components';
//import { c, f, s } from '../../styles/themeUtils';

export default function Search() {
  return (
    <>
      <SearchBox placeholder="원하는 이야기를 검색해보세요." />
    </>
  );
}

const SearchBox = styled.input`
  //임시
  margin: 10px 15px;
  width: 95%;
  height: 50px;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
