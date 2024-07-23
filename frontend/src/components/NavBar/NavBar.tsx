import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

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
    <nav className="bg-gray-800 text-white h-12 p-4">
      <ul className="flex justify-around items-center h-full">
        {!isLoggedIn && (
          <>
            <li className="mx-4">
              <Link to="/" className="font-bold hover:text-gray-300">로고(홈)</Link>
            </li>
            <li className="mx-4">
              <Link to="/teatime" className="font-bold hover:text-gray-300">티타임</Link>
            </li>
            <li className="mx-4">
              <Link to="/sharing" className="font-bold hover:text-gray-300">나눔</Link>
            </li>
            <li className="mx-4">
              <Link to="/webrtc" className="font-bold hover:text-gray-300">WebRTC</Link>
            </li>
            <li className="mx-4">
              <button
                onClick={handleLoginClick}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
              >
                로그인
              </button>
            </li>
          </>
        )}
        {isLoggedIn && (
          <>
            <li className="mx-4">
              <Link to="/" className="font-bold hover:text-gray-300">로고(홈)</Link>
            </li>
            <li className="mx-4">
              <Link to="/teatime" className="font-bold hover:text-gray-300">티타임</Link>
            </li>
            <li className="mx-4">
              <Link to="/sharing" className="font-bold hover:text-gray-300">나눔</Link>
            </li>
            <li className="mx-4">
              <Link to="/webrtc" className="font-bold hover:text-gray-300">WebRTC</Link>
            </li>
            <li className="mx-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                마이페이지(구현안되어있음)
              </button>
            </li>
            <li className="mx-4">
              <button
                onClick={handleLogoutClick}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
              >
                로그아웃
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;