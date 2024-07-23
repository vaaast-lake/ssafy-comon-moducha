import { create } from 'zustand';
import axiosInstance from '../api/axios';

interface ShareState {
  shareList: object;
  fetchShareList: () => void;
}
const testShare = {
  // 테스트를 위한 shareList JSON response 객체
  message: '나눔 게시판 목록 조회가 성공적으로 완료되었습니다.',
  data: {
    pagination: {
      total: 25,
      page: 1,
      perPage: 10,
    },
    items: [
      {
        shareBoardId: 1,
        title: 'Post Title 1',
        createdDate: '2023-07-01T12:00:00Z',
        lastUpdated: '2023-07-10T15:00:00Z',
        maxParticipants: 5,
        participants: 3, // 현재 참여한 인원
      },
      {
        shareBoardId: 2,
        title: 'Post Title 2',
        createdDate: '2023-07-02T12:00:00Z',
        lastUpdated: '2023-07-11T15:00:00Z',
        maxParticipants: 7,
        participants: 4, // 현재 참여한 인원
      },
      // ... (페이지당 항목 수만큼 반복)
    ],
  },
};

export const useShareStore = create<ShareState>((set) => ({
  shareList: testShare,
  fetchShareList: () => {
    axiosInstance
      .get('shares')
      .then((res) => {
        set({ shareList: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  },
}));
