import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import TeaTime from './pages/TeaTime/TeaTime';
import Nanum from './pages/Nanum/Nanum';
import Notifications from './pages/Notifications/Notifications';
import WebRTC from './pages/WebRTC/WebRTC';

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
        path: 'nanum',
        element: <Nanum />,
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
]);

// RouterProvider에 라우트 객체들이 렌더링
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
