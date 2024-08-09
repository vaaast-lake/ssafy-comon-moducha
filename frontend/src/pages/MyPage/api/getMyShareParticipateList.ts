import axiosInstance from '../../../api/axiosInstance';
import useAuthStore from '../../../stores/authStore';
import { AxiosResponse } from 'axios';
const { currentUserId } = useAuthStore.getState();

interface MypageShareParticipateListRequestParams {
  status?: 'before' | 'ongoing'; // 필터링 상태
  page?: number; // 페이지 번호 (기본값: 1)
  perPage?: number; // 페이지 당 항목 수 (기본값: 12)
}

interface MypageShareParticipateListResponseItem {
  shareBoardId: number;
  title: string;
  content: string;
  createdDate: string;
  lastUpdated: string;
  endDate: string;
  nickname: string;
  maxParticipants: number;
  participants: number;
  viewCount: number;
}

interface MypageShareParticipateListResponse {
  data: {
    items: MypageShareParticipateListResponseItem[];
    pagination: {
      total: number;
      page: number;
      perPage: number;
    };
  };
}

async function getMyShareParticipateList({
  status,
  page = 1,
  perPage = 12,
}: MypageShareParticipateListRequestParams): Promise<MypageShareParticipateListResponse> {
  try {
    const response: AxiosResponse<MypageShareParticipateListResponse> =
      await axiosInstance.get(
        `/users/${currentUserId}/mypage/participated-shares`,
        {
          params: {
            status,
            page,
            perPage,
          },
        }
      );

    return response.data;
  } catch (error) {
    console.error('Error fetching my shares participate list:', error);
    throw error; // 오류가 발생하면 호출한 쪽에서 처리하도록 예외를 던집니다.
  }
}

export default getMyShareParticipateList;
