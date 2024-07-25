import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import navModucha from '/logo/nav-moducha.svg';

const NavBar = () => {
  const { isLoggedIn, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    logout();
    console.log('로그아웃(at AuthStore)');
    navigate('/');
  };

  return (
    <div className="flex justify-center border-b-2 border-[#eee]">
      {/* border-bottom: 2px solid #EEE; */}
      <nav className="flex justify-between w-full lg:w-2/3 h-20 items-center">
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
                  to="/sharing"
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
                  to="/sharing"
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
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                  마이페이지(구현안되어있음)
                </button>
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
