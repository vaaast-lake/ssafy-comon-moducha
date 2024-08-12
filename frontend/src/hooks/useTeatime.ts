import { useParams, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import axiosInstance from '../api/axiosInstance';

export const useTeatime = (boardType: string, title: string) => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const { userName, accessToken, setTeatimeToken } = useAuthStore(
    (state) => ({
      userName: state.currentUsername,
      accessToken: state.token,
      teatimeToken: state.teatimeToken,
      setTeatimeToken: state.setTeatimeToken,
    })
  );

  const teatimeIsOpen = async (): Promise<boolean> => {
    try {
      const response = await axiosInstance.get(`${boardType}/${boardId}/lives`);
      return response.data.data.open;
    } catch (err) {
      console.error('Error checking if teatime is open:', err);
      return false;
    }
  };

  const joinTeatime = async () => {
    navigate('/teatimes/room', { state: { roomName: `${title}` } });
  };

  const applyTeatime = async () => {
    await axiosInstance
      .post(`${boardType}/${boardId}/participants`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          name: `${userName}`,
          phone: '000-0000-0000',
          address: 'home address',
        },
      })
      .then((res) => {
        setTeatimeToken(res.data.data.token);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createRoomToken = async () => {
    await axiosInstance
      .post(
        `${boardType}/${boardId}/lives`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((res) => {
        setTeatimeToken(res.data.data.token);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const getRoomToken = async () => {
    await axiosInstance
      .post(
        `${boardType}/${boardId}/lives/token`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((res) => {
        setTeatimeToken(res.data.data.token);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const startTeatime = async () => {
    const isOpen = await teatimeIsOpen();
    if(isOpen) {
      getRoomToken();
    }
    else {
      createRoomToken();
    }
    joinTeatime();
  };


  return { applyTeatime, startTeatime, joinTeatime, teatimeIsOpen };
};
