import './Login.css';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLogin } from '@react-oauth/google';

const imgSrc =
  'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?q=80&w=2678&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const Login = () => {
  const isLoggedIn = false; // 테스트용

  return (
    <>
      <div className="login-container">
        <div className="image-container">
          <img src={imgSrc} alt="Login Background" />
        </div>
        <div className="button-container">
          <div className="google-button">
            {isLoggedIn ? (
              <div>
                <p>[로그인 상태입니다]</p>
              </div>
            ) : (
              <div>
                <p>[로그아웃 상태입니다]</p>
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    console.log(credentialResponse);
                  }}
                  onError={() => {
                    console.log('Login Failed');
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
