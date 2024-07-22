import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import GoogleLogin from '../../components/OAuth/GoogleLogin';
import GoogleLogout from '../../components/OAuth/GoogleLogout';
import { postLoginToken } from '../../api/postLoginToken.js';
import getUserInfo from '../../api/getUserInfo'; // getUserInfo 함수가 있는 경로를 올바르게 지정해 주세요
//tmp App.js 코드 참고중
  // State to track login status
  // const [isLogin, setIsLogin] = useState(false);

  // Effect to initialize login status when the component mounts
  // useEffect(() => {
  //   const initLogin = async () => {
  //     // Fetch user info to determine if user is logged in
  //     const name = await getUserInfo();
  //     // Update login state based on fetched user info
  //     setIsLogin(!!name);
  //   };
  //   initLogin();
  // }, []);
//tmp
// Login 컴포넌트를 화살표 함수로 정의하고 export default로 내보냄
const Login = ({ isLogin, setIsLogin }) => {
  // useNavigate 훅을 사용하여 페이지 이동 기능을 사용
  const navigate = useNavigate();

  // Google 로그인 버튼 클릭 시 호출되는 함수
  const onGoogleSignIn = async (res) => {
    // Google 로그인 응답에서 인증 정보를 추출
    const { credential } = res;

    // 인증 정보를 서버로 전송하고 로그인 결과를 받음
    // postLoginToken 함수는 API 호출을 담당하며, 로그인 성공 여부를 반환
    const result = await postLoginToken(credential, setIsLogin);

    // 로그인 결과에 따라 상태를 업데이트
    setIsLogin(result);
  };

  // isLogin일때 /mypage로 이동, 이 부분은 라우팅하기 나름이라 지우면 됨.
  useEffect(() => {
    if (!isLogin) return;
    navigate('/mypage');
  }, [isLogin]);

  // Google 로그아웃 버튼 클릭 시 호출되는 함수
  const onGoogleSignOut = () => {
    // 로그인 상태를 false로 업데이트
    setIsLogin(false);
  };

  // State to track login status
  const [localIsLogin, setLocalIsLogin] = useState(false);

  // Effect to initialize login status when the component mounts
  useEffect(() => {
    const initLogin = async () => {
      // Fetch user info to determine if user is logged in
      const name = await getUserInfo();
      // Update login state based on fetched user info
      setLocalIsLogin(!!name);
    };
    initLogin();
  }, []);

  return (
    <div>
      <h1>Google Login(Login.tsx)</h1>
      {/* 로그인 상태에 따라 Google 로그인 또는 로그아웃 버튼을 렌더링 */}
      {localIsLogin ? (
        // Google 로그아웃 버튼 컴포넌트 렌더링
        // onGoogleSignOut 함수가 로그아웃 완료 후 호출됨
        <GoogleLogout onGoogleSignOut={onGoogleSignOut} />
      ) : (
        // onGoogleSignIn 함수가 로그인 완료 후 호출됨
        <GoogleLogin onGoogleSignIn={onGoogleSignIn} text="로그인" />
      )}
    </div>
  );
};

export default Login;
