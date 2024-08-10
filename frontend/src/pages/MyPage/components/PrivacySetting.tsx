import useAuthStore from '../../../stores/authStore';
import axiosInstance from '../../../api/axiosInstance';
import { handleLogout } from '../../../api/logout';
import updateNickname from '../api/updateNickname';

const AccountDeactivation = () => {
  const { setLoggedIn, setCurrentUsername } = useAuthStore.getState();

  // 회원탈퇴 API
  const handleDeactivate = async () => {
    // 탈퇴 확인 메시지
    const isConfirmed = window.confirm(
      '정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
    );
    if (!isConfirmed) {
      // 사용자가 취소한 경우
      return;
    }

    try {
      const response = await axiosInstance.patch('/users/withdraw');

      if (response.status === 204) {
        localStorage.removeItem('authorization'); // Access token 제거
        alert('모두차를 이용해 주셔서 감사합니다');
        handleLogout(setLoggedIn, setCurrentUsername);
      } else {
        // 비정상적인 상태 코드가 응답으로 오면
        console.error('Unexpected response status: ', response.status);
        alert('[debug]: 알 수 없는 response 에러');
      }
    } catch (error: any) {
      if (error.response) {
        // 서버에서 응답이 있는 경우
        const status = error.response.status;

        if (status === 401) {
          // 401 Unauthorized - 권한이 없는 유저 처리
          console.log('권한이 없는 유저입니다');
          // 여기서는 리프레시 토큰 로직을 axiosInstance에서 처리하므로 별도로 처리하지 않습니다.
        } else if (status === 500) {
          // 500 Internal Server Error
          alert('잠시 후 다시 시도해주세요.(500)');
        } else {
          // 기타 에러
          console.error(
            'response.status = ' + status,
            ': 알 수없는 response 에러'
          );
          alert('[debug]: 알 수 없는 response 에러');
        }
      } else {
        // 네트워크 오류 등 서버 응답이 없는 경우
        console.error('Network error: ', error.message);
        alert('[debug]: 네트워크 오류');
      }
    }
  };

  return (
    <>
      <div>닉네임 수정하기</div>
      <div>
        <h1 className="font-semibold text-2xl">회원 탈퇴</h1>
        <p className="text-red-500">
          작성한 글, 댓글, 대댓글은 삭제하지 않으면 탈퇴 이후에도 남겨집니다.
        </p>
        <button onClick={handleDeactivate} className="font-semibold">
          회원 탈퇴
        </button>
        <br />
      </div>
    </>
  );
};

export default AccountDeactivation;
