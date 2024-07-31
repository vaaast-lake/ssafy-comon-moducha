import { Link, useNavigate } from 'react-router-dom';
import navModucha from '/logo/nav-moducha.svg';
import useAuthStore from '../../stores/authStore';

const NavBar = () => {
  const { isLoggedIn, setLoggedIn, setCurrentUsername } = useAuthStore();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = async () => {
    try {
      const accessToken = localStorage.getItem('authorization');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      // const response = await fetch(
      //   import.meta.env.VITE_API_URL + '/api/v1/logout',
      //   {
      //     method: 'POST',
      //     headers: {
      //       Authorization: `Bearer ${accessToken}`,
      //       'Content-Type': 'application/json',
      //     },
      //   }
      // );

      // if (!response.ok) {
      //   throw new Error('Logout failed');
      // }
      // 성공적으로 로그아웃 처리
      setLoggedIn(false);
      setCurrentUsername('');
      localStorage.removeItem('authorization');
      console.log(
        '로그아웃(at AuthStore)-추후 API /logout으로 구현 추가하세요'
      );

      // 홈으로 리디렉션
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // 사용자에게 에러 메시지 표시하거나 추가 처리
    }
  };
  return (
    <div className="flex justify-center border-b-2 border-[#eee]">
      {/* border-bottom: 2px solid #EEE; */}
      <nav className="flex justify-between w-full lg:w-2/3 h-16 items-center">
        <Link to="/" className="btn btn-ghost">
          <img src={navModucha} alt="" />
        </Link>
        <ul className="flex shrink-0 justify-between items-center gap-4 mr-5">
          {!isLoggedIn && (
            <>
              <li>
                <Link
                  to="/teatime"
                  className="text-center text-[#6d6d6d] text-lg font-medium hover:text-black"
                >
                  티타임
                </Link>
              </li>
              <li>
                <Link
                  to="/shares"
                  className="text-center text-[#6d6d6d] text-lg font-medium hover:text-black"
                >
                  나눔
                </Link>
              </li>
              <li>
                <Link
                  to="/webrtc"
                  className="text-center text-[#6d6d6d] text-lg font-medium hover:text-black"
                >
                  WebRTC
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLoginClick}
                  className="text-center text-[#6d6d6d] text-lg font-medium hover:text-black"
                >
                  로그인
                </button>
              </li>
            </>
          )}
          {isLoggedIn && (
            <>
              <li>
                <Link
                  to="/"
                  className="text-center text-[#6d6d6d] text-lg font-medium hover:text-black"
                >
                  로고(홈)
                </Link>
              </li>
              <li>
                <Link
                  to="/teatime"
                  className="text-center text-[#6d6d6d] text-lg font-medium hover:text-black"
                >
                  티타임
                </Link>
              </li>
              <li>
                <Link
                  to="/shares"
                  className="text-center text-[#6d6d6d] text-lg font-medium hover:text-black"
                >
                  나눔
                </Link>
              </li>
              <li>
                <Link
                  to="/webrtc"
                  className="text-center text-[#6d6d6d] text-lg font-medium hover:text-black"
                >
                  WebRTC
                </Link>
              </li>
              <li>
                <Link
                  to="/mypage"
                  className="text-center text-[#6d6d6d] text-lg font-medium hover:text-black"
                >
                  마이페이지
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogoutClick}
                  className="text-center text-[#6d6d6d] text-lg font-medium hover:text-black"
                >
                  로그아웃
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
