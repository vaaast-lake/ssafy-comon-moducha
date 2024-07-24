import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore'; 
import { useEffect } from 'react';
import GoogleLogin from './components/GoogleLogin';
import GoogleLogout from './components/GoogleLogout';
import { postLoginToken } from '../../api/postLoginToken';
import Cookies from 'js-cookie';

import './Login.css';

const logAllCookies = () => {
  console.log('All cookies:', Cookies.get()); 
};

logAllCookies();
const Login = () => {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();

  // 쿠키를 확인하여 로그인 상태 초기화
  useEffect(() => {
    const authToken = Cookies.get('AUTH-TOKEN');
    console.log('Initial AUTH-TOKEN from cookies:', authToken); // 디버깅 로그 추가
    if (authToken) {
      login(); // 쿠키가 있으면 로그인 상태로 설정
    }
  }, [login]);

  const handleLogin = () => {
    const authToken = Cookies.get('AUTH-TOKEN');
    console.log('AUTH-TOKEN on handleLogin:', authToken); // 디버깅 로그 추가
    //임시코드. 쿠키 여부 상관없이 구글 로그인 시도하면 로그인 시키기
    // login();
    // console.log('임시 코드에 따라 일단 Login state로 두었습니다. 디버깅용');
    // navigate('/');


    if (authToken) {
      login(); // isLoggedIn = true;
      navigate('/');
    }
    else {
      console.log('로그인을 시도하였으나 쿠키에 AUTH-TOKEN이 존재하지 않습니다.');
    }
  }
  const handleLogout = () => {
    console.log('AUTH-TOKEN before removing:', Cookies.get('AUTH-TOKEN')); // 디버깅 로그 추가
    Cookies.remove('AUTH-TOKEN'); // 쿠키삭제
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
    console.log('result: ' + result);
    handleLogin();
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