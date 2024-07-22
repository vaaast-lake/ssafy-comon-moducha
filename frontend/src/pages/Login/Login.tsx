import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore'; 
import GoogleLogin from './components/GoogleLogin.jsx';
import GoogleLogout from './components/GoogleLogout.jsx';
import { postLoginToken } from '../../api/postLoginToken.js';

const Login = () => {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();

  const handleLogin = () => {
    login(); // Zustand의 로그인 함수 호출
    navigate('/');
  }
  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  const onGoogleSignIn = async (res) => {
    // Google 로그인 응답에서 인증 정보를 추출
    const { credential } = res;
    // 인증 정보를 서버로 전송하고 로그인 결과를 받음
    // postLoginToken 함수는 API 호출을 담당하며, 로그인 성공 여부를 반환
    const result = await postLoginToken(credential);
    if (result) { // Google OAuth2 로그인 처리하기
      handleLogin();
      console.log('Google OAuth2 로그인 요청 성공');
    } else {
      console.log('Google OAuth2 로그인 요청 오류');
    }
    console.log('useAuthStore isLoggedIn: ',useAuthStore.getState().isLoggedIn);
  };

  const onGoogleSignOut = () => {
    handleLogout();
  };

  return (
    <div>
      {isLoggedIn ? (
        <GoogleLogout onGoogleSignOut={onGoogleSignOut}/>
      ) : (
        <GoogleLogin onGoogleSignIn={onGoogleSignIn} text="로그인" />
      )}
    </div>
  );
};

export default Login;