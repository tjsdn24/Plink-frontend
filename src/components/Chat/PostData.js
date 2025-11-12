export const postData = [
  {
    id: 1,
    nickname: '한태인',
    content: [{ type: 'text', data: '안녕하세요 까치산입니다!!!!!' }],
    like: 8,
    comment: 2,
    comments: [
      { nickname: '명지수', text: '안냐세요 전 극아타임다', time2: '2분 전' },
      { nickname: '유다빈', text: '까치산 최고', time2: '1분 전' },
    ],
    time: '5분 전',
    category: '기타',
  },
  {
    id: 2,
    nickname: '눈멍이',
    content: [
      { type: 'text', data: '같이 공연보실 분??' },
      {
        type: 'images',
        data: [
          'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTEwMDZfMjk2%2FMDAxNzU5NzMyODI3Njgy.G5oNbKDSUlILNHIk2VjSSbKyaParDerv9jB4UeyUie4g.Hy75tZTMSjcMx5CcI1oixkNjPBTou48uCUr7SgjQvBgg.JPEG%2FIMG%25A3%25DF3237.JPG&type=sc960_832',
          'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzEwMDhfNjkg%2FMDAxNjk2NzU2MzI2Nzgy.rFzp46ZMtF2qiFeawKsJB1qpjvW6nwqGCReY6CqA4jAg.l0S57DdtLF4zO9SOdb3MtGXt2Un8ENJl21nUM4GlGYYg.JPEG.albaca%2FIMG_2708.JPG&type=sc960_832',
          'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTEwMDRfMTE2%2FMDAxNzU5NTE4NjcyMTc5.r5Ll2N01vWNdbryUrpTVx1JFh7mucrmV85lralnrhxAg.1azJbiGyyiCkEHeGxJbdnsp1mqJnBt001B_oJYfJZMUg.JPEG%2FIMG%25A3%25DF5773.JPG&type=sc960_832',
        ],
      },
    ],
    like: 15,
    comment: 5,
    comments: [
      { nickname: '가나디', time: '2분전', text: '저요저요제가아니면안돼요', time2: '19분 전' },
      { nickname: '듀듀', text: '이 사진은 뭔가요?', time2: '17분 전' },
      { nickname: '마루', text: '마루총총', time2: '15분 전' },
      { nickname: '임주스', text: '피크닉?', time2: '10분 전' },
      { nickname: '냐옹이', text: '안냐옹', time2: '8분 전' },
      { nickname: '멈머', text: '월월ㄹㄹ', time2: '2분 전' },
    ],
    time: '20분 전',
    category: '만남/동행',
  },
  {
    id: 3,
    nickname: '커비',
    content: [
      { type: 'text', data: '점메추' },
      {
        type: 'poll',
        data: {
          options: ['된찌', '엽떡', '고치돈', '샌드위치'],
          votes: [5, 8, 3, 2],
        },
      },
    ],
    like: 4,
    comment: 1,
    comments: [{ nickname: '김치러버', text: '김치말이국수 추천', time2: '30분 전' }],
    time: '1시간 전',
    category: '질문/요청',
  },
];
