import Profile from './components/Profile';
import Records from './components/Records';
import Shares from './components/Shares';
import Teatimes from './components/Teatimes';
import AccountDeactivation from './components/AccountDeactivation';
import './ProfilePage.css';

const ProfilePage = () => {
  return (
    <div>
      <Profile />
      <Records />
      <Shares />
      <Teatimes />
      <AccountDeactivation />
    </div>
  );
};

export default ProfilePage;
