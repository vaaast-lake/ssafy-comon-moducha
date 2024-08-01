import './LoginPage.css';
import LoginModal from './LoginModal';
import LoginImg from '/LoginImg.png';
import useAuthStore from '../../stores/authStore';
import { Navigate } from 'react-router-dom';
import { Button } from '@headlessui/react';
const LoginPage = () => {
  const { isLoggedIn, setLoggedIn } = useAuthStore();
  if (isLoggedIn) {
    return <Navigate to="/mypage" />;
  }

  return (
    <>
      <div className="login-container">
        <div className="image-container">
          <img src={LoginImg} alt="Login Background" />
        </div>
        <div className="button-container">
          <div className="login-title">Login</div>
          <div className="google-button">
            {isLoggedIn ? (
              <div>
                <p>[Dev: 로그인 상태입니다]</p>
              </div>
            ) : (
              <div>
                <LoginModal />
                <div className="test-login-button">
                  <Button
                    onClick={() => {
                      console.log('test login');
                      setLoggedIn(true);
                      localStorage.setItem(
                        'authorization',
                        'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6IkF1dGhvcml6YXRpb24iLCJ1c2VySWQiOjEsInVzZXJuYW1lIjoi66ek64GE65-96rKMIO2DgeyblO2VnCDrp53slYTsp4A2NCIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzIyNDk2NjcyLCJleHAiOjE3MjI0OTcyNzJ9.8qMlZ5gT2VzChz7r66rbrVoVqBGcfOpUT7LtfteibIU'
                      ); // for dev only
                      return window.location.reload();
                    }}
                  >
                    Test Login
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
