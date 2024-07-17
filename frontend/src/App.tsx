// import Bear from './pages/Bear';

// const App = () => {
//   return <Bear />;
// };

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './pages/Login';
// 임시 페이지(라우팅 테스팅 용)
import TeaTime from './pages/TeaTime';
import Sharing from './pages/Sharing';
import MyPage from './pages/MyPage';
import Notifications from './pages/Notifications';
// 나브바 구현 테스팅 중

const App: React.FC = () => {
  return (
    <Router>
      <NavBar />

      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/teatime" element={<TeaTime />} />
        <Route path="/sharing" element={<Sharing />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/notifications" element={<Notifications />} />
        {/* 필요한 다른 경로들도 설정해줍니다 */}
      </Routes>
    </Router>
  );
};

export default App;
