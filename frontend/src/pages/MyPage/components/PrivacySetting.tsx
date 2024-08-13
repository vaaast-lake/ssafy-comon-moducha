import { useState } from 'react';
import useAuthStore from '../../../stores/authStore';
import axiosInstance from '../../../api/axiosInstance';
import { handleLogout } from '../../../api/logout';
import updateNickname from '../api/updateNickname';

const AccountDeactivation = () => {
  const { setLoggedIn, setCurrentUsername, currentUsername } =
    useAuthStore.getState();

  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(currentUsername);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>(
    ''
  );

  // 회원탈퇴 API
  const handleDeactivate = async () => {
    const isConfirmed = window.confirm(
      '정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
    );
    if (!isConfirmed) {
      return;
    }

    try {
      const response = await axiosInstance.patch('/users/withdraw');

      if (response.status === 204) {
        localStorage.removeItem('authorization');
        alert('모두차를 이용해 주셔서 감사합니다');
        handleLogout(setLoggedIn, setCurrentUsername);
      } else {
        console.error('Unexpected response status: ', response.status);
        alert('[debug]: 알 수 없는 response 에러');
      }
    } catch (error) {
      console.error('Network error: ', error.message);
      alert('[debug]: 네트워크 오류');
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const response = await updateNickname({ nickname });

      if (response.error) {
        const { status, message } = response.error;

        if (status === 400) {
          if (message === '변경 전과 동일한 닉네임입니다.') {
            setFeedbackMessage('변경 전과 동일한 닉네임입니다.');
          } else if (message === '이미 존재하는 닉네임입니다.') {
            setFeedbackMessage('이미 존재하는 닉네임입니다.');
          } else {
            setFeedbackMessage('잘못된 요청입니다.');
          }
        } else if (status === 401) {
          setFeedbackMessage('로그인 정보가 없습니다. 다시 로그인해 주세요.');
        } else if (status === 403) {
          setFeedbackMessage('권한이 없습니다.');
        } else if (status === 409) {
          setFeedbackMessage('닉네임 충돌이 발생했습니다.');
        } else if (status === 500) {
          setFeedbackMessage(
            '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
          );
        } else {
          setFeedbackMessage('알 수 없는 오류가 발생했습니다.');
        }

        setFeedbackType('error');
        return;
      }

      const {
        data: { nickname: updatedNickname },
        token,
      } = response;

      if (token) {
        localStorage.setItem('authorization', token);
      }

      setCurrentUsername(updatedNickname);
      setFeedbackMessage('닉네임이 성공적으로 수정되었습니다.');
      setFeedbackType('success');
      setIsEditing(false);

      // 2초 후 페이지 새로 고침
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error updating nickname: ', error.message);
      setFeedbackMessage('닉네임 수정 중 오류가 발생했습니다.');
      setFeedbackType('error');
    }
  };

  return (
    <>
      <div className="mt-4">
        <label htmlFor="nickname" className="block text-lg font-semibold">
          닉네임
        </label>
        {isEditing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveClick();
            }}
          >
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="border border-gray-300 p-2"
            />
            <button type="submit" className="ml-2 font-semibold">
              수정완료
            </button>
          </form>
        ) : (
          <div>
            <span>{nickname}</span>
            <button onClick={handleEditClick} className="ml-2 font-semibold">
              닉네임 수정하기
            </button>
          </div>
        )}
        {feedbackMessage && (
          <p
            className={`mt-2 ${feedbackType === 'error' ? 'text-red-500' : 'text-green-500'}`}
          >
            {feedbackMessage}
          </p>
        )}
      </div>
      <div className="mt-4">
        <h1 className="font-semibold text-2xl">회원 탈퇴</h1>
        <p className="text-red-500">
          작성한 글, 댓글, 대댓글은 삭제하지 않으면 탈퇴 이후에도 남겨집니다.
        </p>
        <button onClick={handleDeactivate} className="font-semibold">
          회원 탈퇴
        </button>
        <br />
      </div>
    </>
  );
};

export default AccountDeactivation;
