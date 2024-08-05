import useAuthStore from '../../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';

const AccountDeactivation = () => {
  const { setLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  // 회원탈퇴 API
  const handleDeactivate = async () => {
    try {
      const response = await axiosInstance.patch('/users/withdraw');

      if (response.status === 204) {
        localStorage.removeItem('authorization'); // Access token 제거
        alert('모두차를 이용해 주셔서 감사합니다');
        setLoggedIn(false); // 프론트에서 로그아웃
        navigate('/login'); // 로그인 페이지로 리다이렉트
      } else {
        // 비정상적인 상태 코드가 응답으로 오면
        console.error('Unexpected response status: ', response.status);
        alert('[debug]: 알 수 없는 response 에러');
      }
    } catch (error) {
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
  // const handleDeactivate = async () => {
  // const accessToken = localStorage.getItem('authorization');
  //   const response = await fetch('/api/v1/users/withdraw', {
  //     method: 'PATCH',
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   });
  //   console.log('[Debug]: response: ', response);
  //   if (response.status === 204) {
  //     localStorage.removeItem('authorization'); // Access token 제거
  //     alert('모두차를 이용해 주셔서 감사합니다');
  //     setLoggedIn(false); // 프론트에서 로그아웃
  //     // refresh를 통해 zustand 상태 초기화 - usenavigate가 로직이 더 효율적일지 고려해보기
  //     navigate('/login');
  //     // window.location.href = '/login';
  //   } else if (response.status === 401) {
  //     // 401 Unauthorize이면
  //     console.log('권한이 없는 유저입니다');
  //     // reissue 시도
  //   } else if (response.status === 500) {
  //     // 500 Internal Server Error.
  //     alert('잠시 후 다시 시도해주세요.(500)');
  //   } else {
  //     // response가 존재하지 않는 등 기타 에러 발생시
  //     console.error(
  //       'response.status = ' + response.status,
  //       ': 알 수없는 response 에러'
  //     );
  //     alert('[debug]: 알 수 없는 response 에러');
  //   }
  // };

  return (
    <div>
      <h2 className="title">[회원 탈퇴]</h2>
      <p>작성한 글은 삭제하지 않으면 탈퇴 이후에도 남겨집니다.</p>
      <button className="abcd" onClick={handleDeactivate}>
        회원 탈퇴
      </button>
      <br />
    </div>
  );
};

export default AccountDeactivation;
