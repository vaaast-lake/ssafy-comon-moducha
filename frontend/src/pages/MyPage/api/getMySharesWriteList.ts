//getMySharesWriteList.ts
import axiosInstance from '../../../api/axiosInstance';
import useAuthStore from '../../../stores/authStore';
const { currentUserId } = useAuthStore.getState();

interface MypageShareWriteListRequest {
  status?: 'all' | 'ongoing'; // 필터링 상태
  page?: number; // 페이지 번호
  limit?: number; // 페이지 당 항목 수
}

interface ShareItem {
  // ShareItem의 데이터 구조를 정의합니다.
  id: string;
  title: string;
  status: 'ongoing' | 'completed';
  // 필요한 다른 필드들 추가
}

interface MypageShareWriteListResponse {
  items: ShareItem[];
  total: number; // 총 항목 수
}

async function getMySharesWriteList(
  params: MypageShareWriteListRequest = {}
): Promise<MypageShareWriteListResponse> {
  try {
    const response = await axiosInstance.get<MypageShareWriteListResponse>(
      `/api/v1/users/${currentUserId}/shares`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error('나의 나눔 목록을 조회하는 중 오류 발생:', error);
    throw error;
  }
}

export default getMySharesWriteList;
