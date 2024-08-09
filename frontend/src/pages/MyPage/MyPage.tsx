import Records from './components/MyRecords';
import MyShares from './components/MyShares';
import Teatimes from './components/MyTeatimes';
import AccountDeactivation from './components/AccountDeactivation';
import MainLayout from '../../components/Layout/MainLayout';
import SideLayout from '../../components/Layout/SideLayout';
import TitleCard from '../../components/Title/TitleCard';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';

const MyPage = () => {
  const { isLoggedIn, currentUsername } = useAuthStore();
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="grid grid-cols-10">
      {/* 좌측 사이드바 영역 */}
      <SideLayout></SideLayout>
      <MainLayout className="gap-4">
        <header>
          <TitleCard>
            <div className="flex justify-between items-center">
              <span className="text-disabled">마이페이지</span>
              {isLoggedIn && (
                <div className="btn btn-sm text-wood bg-papaya">
                  {currentUsername}
                </div>
              )}
            </div>
          </TitleCard>
          <div className="divider"></div>
        </header>
        <Records />
        <div className="divider"></div>
        <Teatimes />
        <div className="divider"></div>
        <MyShares />
        <div className="divider"></div>
        <AccountDeactivation />
      </MainLayout>
      {/* 우측 사이드바 영역 */}
      <SideLayout></SideLayout>
    </div>
  );
};

export default MyPage;
