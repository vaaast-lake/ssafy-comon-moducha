import './Login.css';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLogin } from '@react-oauth/google';

const imgSrc =
  'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?q=80&w=2678&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const Login = () => {
  const isLoggedIn = false; // 테스트용. 로직 구현 끝나면 zustand에서 초기화예정

  // codeResponse의 code: '@#$@#$' 부분이 Authorization code이고 Spring으로 리다이렉트한다.
  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log(
        'Google 로그인 시도: Auth_code(codeResponse)=',
        codeResponse,
        '백엔드로 redirect하세요'
      );
      try {
        const response = await fetch(
          // 백엔드 redirect 주소. 지금 백엔드에서 구현 안되어있으므로 나중에 바꾸기.
          'http://localhost:8080/api/v1/login/oauth2/code/google',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code: codeResponse.code,
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Spring으로 auth_code를 전송하지 못했습니다. ');
        }

        const data = await response.json();
        console.log('Success:', data);
      } catch (error) {
        console.error('Error:', error);
      }
    },
    flow: 'auth-code',
    redirect_uri: 'http://localhost:8080/api/v1/login/oauth2/code/google',
  });

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
                <button onClick={() => login()}>Sign in with Google 🚀</button>
                ;
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
