import './LoginPage.css';
import LoginModal from './LoginModal';
import LoginImg from '/LoginImg.png';

const isLoggedIn = false; // 테스트용. 로직 구현 끝나면 zustand에서 초기화예정
const imgSrc =
  'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?q=80&w=2678&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
const LoginPage = () => {
  return (
    <>
      <div className="login-container">
        <div className="image-container">
          {/* <img src={imgSrc} alt="Login Background" /> */}
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
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
