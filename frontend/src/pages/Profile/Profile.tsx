import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';

const Profile = () => {
  const { setCurrentUsername, currentUsername, isLoggedIn } = useAuthStore();
  const [username, setUsername] = useState(currentUsername);
  const [isEditing, setIsEditing] = useState(false); // 닉네임 수정 여부에 따라 form 모양 바꾸는 local state 변수

  useEffect(() => {
    // 로그인하지 않은 상태일 때 홈으로 리디렉션
    if (!isLoggedIn) {
      return <Navigate to="/" />;
    }
  }, [isLoggedIn]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentUsername(username); // 새로운 사용자 이름 설정
    setIsEditing(false); // 편집 모드 종료
  };

  const handleChange = (e) => {
    setUsername(e.target.value); // 입력 필드 값 변경
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing); // 편집 모드 토글
  };

  // 로그인하지 않은 상태일 때 홈으로 리디렉션
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h1>마이페이지</h1>
      <div>
        <span>닉네임</span>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={username}
              onChange={handleChange}
              placeholder={currentUsername}
            />
            <button type="submit">[수정완료]</button>
          </form>
        ) : (
          <div>
            {currentUsername} {/* 기존 사용자 이름을 표시 */}
            <button onClick={toggleEditMode}>[수정하기]</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
