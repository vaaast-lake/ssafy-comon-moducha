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

const shareResponse = {
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

export default shareResponse;
