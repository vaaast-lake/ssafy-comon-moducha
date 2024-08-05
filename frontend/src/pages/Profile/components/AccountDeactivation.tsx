import useAuthStore from '../../../stores/authStore';
import { useNavigate } from 'react-router-dom';

const AccountDeactivation = () => {
  const { setLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('authorization');

  // 회원탈퇴 API
  const handleDeactivate = async () => {
    const response = await fetch('/api/v1/users/withdraw', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('[Debug]: response: ', response);
    if (response.status === 200) {
      localStorage.removeItem('authorization'); // Access token 제거
      alert('모두차를 이용해 주셔서 감사합니다');
      setLoggedIn(false); // 프론트에서 로그아웃
      // refresh를 통해 zustand 상태 초기화 - usenavigate가 로직이 더 효율적일지 고려해보기
      navigate('/login');
      // window.location.href = '/login';
    } else if (response.status === 401) {
      // 401 Unauthorize이면
      console.log('권한이 없는 유저입니다');
      // reissue 시도
    } else if (response.status === 500) {
      // 500 Internal Server Error.
      alert('잠시 후 다시 시도해주세요.(500)');
    } else {
      // response가 존재하지 않는 등 기타 에러 발생시
      console.error(
        'response.status = ' + response.status,
        ': 알 수없는 response 에러'
      );
      alert('[debug]: 알 수 없는 response 에러');
    }
  };

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
