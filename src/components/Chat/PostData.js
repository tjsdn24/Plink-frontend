export const postData = [
  {
    id: 1,
    nickname: '한태인',
    content: [{ type: 'text', data: '안녕하세요 까치산입니다!!!!!' }],
    like: 8,
    comment: 2,
    comments: [
      { nickname: '명지수', text: '안냐세요 전 극아타임다' },
      { nickname: '유다빈', text: '까치산 최고' },
    ],
    time: '5분 전',
  },
  {
    id: 2,
    nickname: '현우',
    content: [
      { type: 'text', data: '주말에 다녀온 여행 사진 공유해요 📸' },
      {
        type: 'images',
        data: [
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
          'https://images.unsplash.com/photo-1526772662000-3f88f10405ff',
        ],
      },
    ],
    like: 15,
    comment: 5,
    comments: [
      { nickname: '소연', text: '풍경 너무 예쁘네요!' },
      { nickname: '진호', text: '어디 다녀오셨어요?' },
    ],
    time: '20분 전',
  },
  {
    id: 3,
    nickname: '예린',
    content: [
      { type: 'text', data: '오늘 점심 뭐 먹을까요? 🍱' },
      {
        type: 'poll',
        data: {
          options: ['김치찌개', '비빔밥', '돈까스', '샐러드'],
          votes: [5, 8, 3, 2],
        },
      },
    ],
    like: 4,
    comment: 1,
    comments: [{ nickname: '다현', text: '전 비빔밥이요 😋' }],
    time: '1시간 전',
  },
];
