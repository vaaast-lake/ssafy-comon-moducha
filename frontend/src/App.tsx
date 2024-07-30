import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Login from './pages/Login/LoginPage';
import Profile from './pages/Profile/Profile';
import TeaTime from './pages/TeaTime/TeaTime';
import Share from './pages/Share/Share';
import Notifications from './pages/Notifications/Notifications';
import WebRTC from './pages/WebRTC/WebRTC';
import ShareDetail from './pages/Share/ShareDetail';
import Access from './pages/Login/Access';
import { GoogleOAuthProvider } from '@react-oauth/google';
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Router 인스턴스 생성, 자식인 Layout 컴포넌트로 페이지 레이아웃 세팅
// 새로운 컴포넌트를 추가하려면 children에 등록해 주세요
// 추가된 컴포넌트들은 Layout의 Outlet에 렌더링 됩니다
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'teatime',
        element: <TeaTime />,
      },
      {
        path: 'sharing',
        element: <Share />,
      },
      {
        path: 'sharing/:shareId',
        element: <ShareDetail />,
      },

      {
        path: 'mypage',
        element: <Profile />,
      },
      {
        path: 'notifications',
        element: <Notifications />,
      },
      {
        path: 'webrtc',
        element: <WebRTC />,
      },
    ],
  },
  { path: 'access', element: <Access /> }, // access token 처리용 더미 페이지
]);

// RouterProvider에 라우트 객체들이 렌더링
const App = () => {
  return (
    <GoogleOAuthProvider
      clientId={CLIENT_ID}
      onScriptLoadError={() =>
        console.log('GoogleOAuthProvider error: clientID를 확인하세요')
      }
      onScriptLoadSuccess={() =>
        console.log(
          'GoogleOAuthProviderLoadSucess: 현재 설정된 clientId=' + CLIENT_ID
        )
      }
    >
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  );
};

export default App;
