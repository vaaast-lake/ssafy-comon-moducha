import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Login from './pages/Login/LoginPage';
import MyPage from './pages/MyPage/MyPage';
import Teatime from './pages/Teatime/Teatime';
import Share from './pages/Share/Share';
import Notifications from './pages/Notifications/Notifications';
import ShareDetail from './pages/Share/ShareDetail';
import TeatimeDetail from './pages/Teatime/TeatimeDetail';
import ShareWrite from './pages/Share/ShareWrite';
import AccessPage from './pages/Login/AccessPage';
import TeatimeWrite from './pages/Teatime/TeatimeWrite';
import ArticleUpdate from './pages/Article/ArticleUpdate';
import TeatimeRoom from './pages/Teatime/TeatimeRoom';
import ErrorPage from './pages/Error/ErrorPage';

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
        path: 'teatimes',
        element: <Teatime />,
      },
      {
        path: 'teatimes/write',
        element: <TeatimeWrite />,
      },
      {
        path: 'teatimes/:boardId/update',
        element: <ArticleUpdate boardType="teatimes" />,
      },
      {
        path: 'teatimes/:boardId',
        element: <TeatimeDetail />,
      },
      {
        path: 'teatimes/room',
        element: <TeatimeRoom />,
      },
      {
        path: 'shares',
        element: <Share />,
      },
      {
        path: 'shares/:boardId',
        element: <ShareDetail />,
      },
      {
        path: 'shares/write',
        element: <ShareWrite />,
      },
      {
        path: 'shares/:boardId/update',
        element: <ArticleUpdate boardType="shares" />,
      },
      {
        path: 'mypage',
        element: <MyPage />,
      },
      {
        path: 'notifications',
        element: <Notifications />,
      },
      { path: 'error', element: <ErrorPage /> },
    ],
  },
  { path: 'access', element: <AccessPage /> }, // access token 처리용 더미 페이지
]);

// RouterProvider에 라우트 객체들이 렌더링
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
