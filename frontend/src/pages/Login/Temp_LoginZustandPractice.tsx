import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = () => {
    login(); // Zustand의 로그인 함수 호출
    navigate('/'); // 로그인 성공하면 홈으로 이동
  };

  return (
    <>
      <h1>
        로그인 페이지입니다. 로그인 State 테스트 버튼과, OAuth2 버튼이 있습니다.
      </h1>
      <br></br>
      <p> OAuth2는 구현중입니다. 로그인 안됩니다. </p>
      <br></br>
      <button onClick={handleLogin}>로그인State로!</button>
    </>
  );
};

export default Login;
