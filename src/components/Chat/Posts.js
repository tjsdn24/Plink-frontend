//import ChatSampleImg from '../../components/ChatSampleImg.svg';

export const postData = [
  {
    id: 1,
    nickname: '숨쉬는 고양이',
    content: [
      {
        type: 'text',
        data: '오늘 축제 후에 술 마실 사람 구해요!',
      },
    ],
    like: 12,
    comment: 7,
    time: '3분 전',
  },
  {
    id: 2,
    nickname: '기타치는 호랑이',
    content: [
      {
        type: 'images',
        data: [
          'https://example.com/image1.jpg',
          'https://example.com/image2.jpg',
          'https://example.com/image3.jpg', //최대 3개 첨부가능
        ],
      },
      {
        type: 'text',
        data: '안녕하세요. 극동아시아타이거즈입니다. 어흥!',
      },
    ],
    like: 1004,
    comment: 99,
    time: '7분 전',
  },
  {
    id: 3,
    nickname: '궁금한 들소',
    content: [
      {
        type: 'text',
        data: 'Q. 지금 집에 간다면?',
      },
      {
        type: 'poll',
        data: {
          options: ['너무 조켄네', '가기 싫어', '기타'],
          votes: [15, 2, 8], // 각 옵션의 투표 수
        },
      },
    ],
    like: 24,
    comment: 0,
    time: '12분 전',
  },
];
