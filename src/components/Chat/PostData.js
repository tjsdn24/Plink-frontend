export const postData = [
  {
    id: 1,
    nickname: '홍길동',
    like: 12,
    comment: 3,
    time: '2시간 전',
    content: [
      {
        type: 'text',
        data: '오늘 날씨 너무 좋네요 ☀️',
      },
    ],
  },
  {
    id: 2,
    nickname: '김철수',
    like: 5,
    comment: 1,
    time: '1시간 전',
    content: [
      {
        type: 'images',
        data: ['/assets/images/sample1.jpg', '/assets/images/sample2.jpg'],
      },
    ],
  },
  {
    id: 3,
    nickname: '이영희',
    like: 8,
    comment: 4,
    time: '30분 전',
    content: [
      {
        type: 'poll',
        data: {
          options: ['고양이 🐱', '강아지 🐶', '둘 다 좋아요 💕'],
          votes: [10, 5, 2],
        },
      },
    ],
  },
];
