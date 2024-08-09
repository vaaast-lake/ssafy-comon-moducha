import SideLayout from '../../components/Layout/SideLayout';
import useAuthStore from '../../stores/authStore';
import MyTeatime from './componenets/MyTeatime';
import ShareList from './componenets/ShareList';
import TeatimeList from './componenets/TeatimeList';

const Home = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return (
    <div className="grid grid-cols-10 mb-20">
      <SideLayout></SideLayout>
      <main className="col-span-10 m-5 lg:col-span-6 flex flex-col gap-14">
        {isLoggedIn && <MyTeatime className="flex flex-col gap-4" />}
        <TeatimeList className="flex flex-col gap-4" />
        <ShareList className="flex flex-col gap-4" />
      </main>
      <SideLayout></SideLayout>
    </div>
  );
};

export default Home;
