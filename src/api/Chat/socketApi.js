import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

// 웹소켓 URL 설정 (SockJS 사용)
// https://plink-api.duckdns.org/ws/feed로 연결
const getSocketUrl = () => {
  // 환경 변수가 있으면 사용, 없으면 기본값 사용
  const envURL = import.meta.env?.VITE_API_BASE_URL?.trim();
  
  if (envURL) {
    // 환경 변수에서 wss:// 또는 ws://가 있으면 https:// 또는 http://로 변환 (SockJS는 HTTP/HTTPS 사용)
    const baseURL = envURL.replace(/^wss:\/\//, 'https://').replace(/^ws:\/\//, 'http://');
    return baseURL + '/ws/feed';
  }
  
  // 기본값: https://plink-api.duckdns.org/ws/feed
  return 'https://plink-api.duckdns.org/ws/feed';
};

const SOCKET_URL = getSocketUrl();

let stompClient = null;
let socket = null;

//웹소켓 연결
export const connectSocket = (onConnected, onError) => {
  try {
    console.log('웹소켓 연결 시도:', SOCKET_URL);
    
    // SockJS 사용
    socket = new SockJS(SOCKET_URL);
    
    // STOMP 클라이언트 초기화
    stompClient = Stomp.over(socket);
    
    // STOMP 디버그 모드 비활성화 (콘솔 로그 줄이기)
    stompClient.debug = () => {};
    
    // STOMP 연결
    stompClient.connect(
      {},
      () => {
        console.log('WebSocket connected (Stomp + SockJS)');
        console.log('_INFO_: Connect STOMP server success, url =', SOCKET_URL, ', connectHeader =');
        if (onConnected) onConnected();
      },
      error => {
        console.error('STOMP 연결 실패:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('웹소켓 연결 초기화 실패:', error);
    if (onError) onError(error);
  }
};

// 웹소켓 연결 해제
export const disconnectSocket = () => {
  if (stompClient && stompClient.connected) {
    stompClient.disconnect();
  }
  if (socket) {
    socket.close();
  }
  stompClient = null;
  socket = null;
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

//사용자 수 구독 (실시간 접속자 수 업데이트)
export const subscribeUserCount = (slug, callback) => {
  if (stompClient && stompClient.connected) {
    const destination = `/topic/festival/${slug}/users`;
    console.log('_INFO_: subscribe destination', destination, 'success');
    return stompClient.subscribe(destination, message => {
      console.log('_INFO_: Receive subscribed message from destination', destination, ', content = MESSAGE');
      const data = JSON.parse(message.body);
      callback(data);
    });
  }
  return null;
};

//사용자 입장 메시지 전송 (메인페이지 접속 시)
export const sendJoinMessage = slug => {
  if (stompClient && stompClient.connected) {
    try {
      const destination = `/app/festival/join/${slug}`;
      // 이미지 형식: content = , header = (빈 문자열과 빈 객체)
      stompClient.send(destination, {}, '');
      console.log('_INFO_: send STOMP message, destination =', destination, ', content = , header =');
      return true;
    } catch (error) {
      console.error('입장 메시지 전송 실패:', error);
      return false;
    }
  }
  console.warn('STOMP 클라이언트가 연결되지 않았습니다.');
  return false;
};
