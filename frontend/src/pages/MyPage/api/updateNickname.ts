import axiosInstance from '../../../api/axiosInstance';
import useAuthStore from '../../../stores/authStore';
import { AxiosResponse } from 'axios';
const { currentUserId } = useAuthStore.getState();

// NicknameUpdateRequest 인터페이스 정의
interface NicknameUpdateRequest {
  nickname: string;
}

// NicknameUpdateResponse 인터페이스 정의
interface NicknameUpdateResponse {
  data: {
    nickname: string;
  };
}

// NicknameUpdateError 인터페이스 정의
interface NicknameUpdateError {
  status: number;
  error: string;
  message: string;
}

/**
 * 사용자의 닉네임을 업데이트하는 함수
 * @param nicknameData - 업데이트할 닉네임 데이터
 * @returns 성공 시 닉네임 데이터, 실패 시 오류 메시지
 */
const updateNickname = async (
  nicknameData: NicknameUpdateRequest
): Promise<NicknameUpdateResponse | NicknameUpdateError> => {
  try {
    // PATCH 요청을 통해 닉네임 업데이트
    const response: AxiosResponse<NicknameUpdateResponse> =
      await axiosInstance.patch(
        `/users/${currentUserId}/nicknames`,
        nicknameData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authorization')}`, // 액세스 토큰을 헤더에 추가
          },
        }
      );
    return response.data; // 성공 시 응답 데이터 반환
  } catch (error: any) {
    if (error.response) {
      // 서버에서 반환한 오류 응답 처리
      const { status, data } = error.response;
      switch (status) {
        case 400:
          // 400 Bad Request 처리
          if (data.message === '변경 전과 동일한 닉네임입니다.') {
            return {
              status,
              error: 'Bad Request',
              message: '변경 전과 동일한 닉네임입니다.',
            };
          } else if (data.message === '이미 존재하는 닉네임입니다.') {
            return {
              status,
              error: 'Bad Request',
              message: '이미 존재하는 닉네임입니다.',
            };
          }
          break;
        case 401:
          return {
            status,
            error: 'Unauthorized',
            message: '로그인 정보가 없습니다.',
          };
        case 403:
          return {
            status,
            error: 'Forbidden',
            message: '권한이 없습니다.',
          };
        case 409:
          return {
            status,
            error: 'Conflict',
            message: '닉네임 충돌 발생',
          };
        case 500:
          return {
            status,
            error: 'Internal Server Error',
            message: '서버 오류가 발생했습니다.',
          };
        default:
          return {
            status,
            error: 'Unknown Error',
            message: '알 수 없는 오류가 발생했습니다.',
          };
      }
    } else {
      // 요청 실패 (네트워크 오류 등)
      return {
        status: 500,
        error: 'Internal Server Error',
        message: '서버와의 연결에 문제가 발생했습니다.',
      };
    }
  }
};

export default updateNickname;
