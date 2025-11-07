import styled from 'styled-components';
import { forwardRef } from 'react';

const Search = forwardRef(({ value, onChange, placeholder = '원하는 이야기를 검색해보세요.' }, ref) => {
  return <SearchBox ref={ref} value={value} onChange={onChange} placeholder={placeholder} />;
});

export default Search;

const SearchBox = styled.input`
  margin: 10px 15px;
  width: 95%;
  height: 50px;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 16px;
`;
