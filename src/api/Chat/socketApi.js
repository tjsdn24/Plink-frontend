import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const SOCKET_URL = 'ws://<SERVER>/ws/feed/websocket';

let stompClient = null;

//웹소켓 연결
export const connectSocket = (onConnected, onError) => {
  const socket = new SockJS(SOCKET_URL);
  stompClient = Stomp.over(socket);
  stompClient.connect({}, onConnected, onError);
};

// 웹소켓 연결 해제
export const disconnectSocket = () => {
  if (stompClient && stompClient.connected) {
    stompClient.disconnect();
  }
};

//피드 구독 (POST 성공 후 서버가 메시지 전송)
export const subscribeFeed = (slug, tagId, callback) => {
  if (stompClient && stompClient.connected) {
    return stompClient.subscribe(`/topic/${slug}/posts/${tagId}`, message => {
      callback(JSON.parse(message.body));
    });
  }
};

//댓글 구독 (POST 성공 후 서버가 메시지 전송)
export const subscribeComment = (slug, postId, callback) => {
  if (stompClient && stompClient.connected) {
    return stompClient.subscribe(`/topic/${slug}/posts/${postId}`, message => {
      callback(JSON.parse(message.body));
    });
  }
};
