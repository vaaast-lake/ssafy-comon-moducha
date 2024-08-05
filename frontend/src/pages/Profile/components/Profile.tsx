import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../../stores/authStore';

const Profile = () => {
  const { setCurrentUsername, currentUsername, isLoggedIn, currentUserId } =
    useAuthStore();
  const [username, setUsername] = useState(currentUsername);
  const [isEditing, setIsEditing] = useState(false);
  const user_id = currentUserId;
  console.log('user_id = ', user_id);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/v1/users/${user_id}/nicknames`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname: username }),
      });
      if (response.ok) {
        const result = await response.json();
        setCurrentUsername(result.data.nickname);
      } else {
        console.error('Failed to update nickname');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setUsername(e.target.value);
  };

  const HandleEditCurrentUsername = () => {
    // API 날리면 얼추 요청 타이밍이 맞을 듯
  };
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h1 className="title">[마이페이지]</h1>
      <div>
        <span>닉네임: {username} </span>

        <span>
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={username}
                onChange={handleChange}
                placeholder={currentUsername}
              />
              <button className="abcd" type="submit">
                수정완료
              </button>
            </form>
          ) : (
            <div>
              {currentUsername}
              <button
                className="abcd"
                onClick={(toggleEditMode, HandleEditCurrentUsername)}
              >
                수정하기
              </button>
            </div>
          )}
        </span>
      </div>
      <br />
    </div>
  );
};

export default Profile;
