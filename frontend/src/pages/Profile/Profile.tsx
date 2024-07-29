import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
// import { getUserInfo } from '../Login/api/getUserInfo';
import useAuthStore from '../../stores/authStore'; 

interface Profile {}

const Profile = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();
  const [info, setInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
  });
  
  useEffect(() => {
    if (!isLoggedIn) navigate('/'); // 예외처리: 로그아웃 상태에서 강제 접근시 인덱스로 보냄

    const initUserinfo = async () => {
      const newinfo = await getUserInfo();
      setInfo(newinfo);
    };
    initUserinfo();
  }, [isLoggedIn, navigate]);
  return (
    <div>
      <h1>My Page</h1>
      <p>email: {info.email}</p>
      <p>name: {`${info.lastName} ${info.firstName}`}</p>
    </div>
  );
};

export default Profile;
