import styled from 'styled-components';
import Search from '../../components/Chat//Search';
import ChatCatagory from '../../components/Chat/ChatCatagory';
import Post from '../../components/Chat/Post';
import WriteButton from '../../components/Chat/WriteButton';

export default function Chat() {
  return (
    <ChatWrapper>
      <Search />
      <ChatCatagory />
      <Post />
      <WriteButton />
    </ChatWrapper>
  );
}

const ChatWrapper = styled.div``;
