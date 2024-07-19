import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import './NavBar.css';

const NavBar = () => {
  const { isLoggedIn, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // 로그인페이지로 이동
  };

  const handleLogoutClick = () => {
    logout(); // 로그아웃
  };

  return (
    <nav>
      <ul>
        {!isLoggedIn && (
          <>
            <li>
              <Link to="/">로고(홈)</Link>
            </li>
            <li>
              <Link to="/teatime">티타임</Link>
            </li>
            <li>
              <Link to="/sharing">나눔</Link>
            </li>
            <li>
              <button onClick={handleLoginClick}>로그인</button>
            </li>
          </>
        )}
        {isLoggedIn && (
          <>
            <li>
              <Link to="/">로고(홈)</Link>
            </li>
            <li>
              <Link to="/teatime">티타임</Link>
            </li>
            <li>
              <Link to="/sharing">나눔</Link>
            </li>
            <li>
              <button>마이페이지(구현안되어있음)</button>
            </li>
            <li>
              <button onClick={handleLogoutClick}>로그아웃</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
