//getMySharesParticipated.ts
import axiosInstance from '../../../api/axiosInstance';
import axios from 'axios';
import useAuthStore from '../../../stores/authStore';
const { currentUserId } = useAuthStore.getState();
// 필터링 상태 고려하기
interface MypageShareParticipateListRequestParams {
  status?: string;
  page?: number;
  limit?: number;
}

interface ShareItem {
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
    items: ShareItem[];
    pagination: {
      total: number;
      page: number;
      perPage: number;
    };
  };
}

/**
 * 마이페이지 내가 참여 신청한 나눔 목록 조회
 * @param userId - 사용자 ID
 * @param params - 요청 파라미터
 * @returns Promise<MypageShareParticipateListResponse>
 */
export const getParticipatedShares = async (
  params: MypageShareParticipateListRequestParams = {}
): Promise<MypageShareParticipateListResponse> => {
  try {
    const response =
      await axiosInstance.get<MypageShareParticipateListResponse>(
        `/users/${currentUserId}/participated-shares`,
        { params }
      );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        switch (error.response.status) {
          case 204:
            console.log('204 No Content');
            // 처리할 코드가 필요하면 추가
            break;
          case 400:
            console.error('Bad Request: ', error.response.data);
            break;
          case 401:
            console.error('Unauthorized: ', error.response.data);
            break;
          case 403:
            console.error('Forbidden: ', error.response.data);
            break;
          case 404:
            console.error('Not Found: ', error.response.data);
            break;
          case 500:
            console.error('Internal Server Error: ', error.response.data);
            break;
          default:
            console.error('Unhandled Error: ', error.response.data);
            break;
        }
      } else {
        console.error('Network Error: ', error.message);
      }
    } else {
      console.error('Unexpected Error: ', error);
    }
    throw error; // 다시 throw하여 호출하는 쪽에서 에러를 처리할 수 있게 함
  }
};

export default getParticipatedShares;
