// 아이템 12개의 테스트 나눔리스트 생성
const genShareListItems = () => {
  const shareItems = [];
  for (let i = 1; i < 13; i++) {
    const shareItem = {
      shareBoardId: i,
      title: 'Post Title ' + i,
      createdDate: '2023-07-01T12:00:00Z',
      lastUpdated: '2023-07-10T15:00:00Z',
      endDate: '2023-07-10T15:00:00Z',
      maxParticipants: 2 + i,
      participants: 1 + i,
    };
    shareItems.push(shareItem);
  }
  return shareItems;
};

export const shareResponse = {
  message: '200 OK',
  data: {
    pagination: {
      total: 25,
      page: 1,
      perPage: 10,
    },
    items: genShareListItems(),
  },
};

export const ShareDetailResponse = {
  data: {
    shareBoardId: 1,
    title: 'share Event',
    content: 'Join us for a tea share event.',
    createdDate: '2023-07-15T10:00:00Z',
    lastUpdated: '2023-07-16T15:30:00Z',
    maxParticipants: 50,
    endDate: '2023-07-19T23:59:59Z',
    viewCount: 100,
    participants: 30, // 현재 참가자
    nickname: '홍길동',
  },
};
