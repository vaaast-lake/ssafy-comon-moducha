import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore'; 
import GoogleLogin from './components/GoogleLogin.jsx';
import GoogleLogout from './components/GoogleLogout.jsx';
import { postLoginToken } from '../../api/postLoginToken.js';
import './Login.css';

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
    console.log('로그아웃(at AuthStore) by GoogleLogout')
    navigate('/');
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
    <>
    <div className="login-container">
      <div className="image-container">
        <img src="https://images.unsplash.com/photo-1514733670139-4d87a1941d55?q=80&w=2678&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
        alt="Login Background" />
      </div>
      <div className="button-container">
        <div className="google-button">
          {isLoggedIn ? (
            <GoogleLogout onGoogleSignOut={onGoogleSignOut}/>
          ) : (
            <GoogleLogin onGoogleSignIn={onGoogleSignIn} text="로그인" />
          )}
        </div>    
      </div>
    </div>
    </>
  );
};

export default Login;