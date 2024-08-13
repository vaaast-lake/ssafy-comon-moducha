import { useEffect, useState } from 'react';
import { useTeatime } from '../../../hooks/useTeatime';
import useAuthStore from '../../../stores/authStore';

interface TeatimeParticipantButtonProps {
  boardType: string;
  title: string;
}

export default function TeatimeParticipantButton({
  boardType,
  title,
}: TeatimeParticipantButtonProps) {
  const { isLogin } = useAuthStore((state) => ({
    teatimeToken: state.teatimeToken,
    isLogin: state.isLoggedIn,
  }));
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [isRoomOpen, setIsRoomOpen] = useState<boolean>(false);
  const { applyTeatime, startTeatime, teatimeIsOpen, teatimeIsApplied } =
    useTeatime(boardType, title);

  useEffect(() => {
    async function getOpenData() {
      const isOpen = await teatimeIsOpen();
      setIsRoomOpen(isOpen);
    }
    async function getAppliedData() {
      const applied = await teatimeIsApplied();
      setIsApplied(applied);
    }
    getOpenData();
    getAppliedData();
  }, []);

  const checkDisableButton = () => {
    if (!isLogin) return true;
    if (isApplied && !isRoomOpen) return true;
    return false;
  };

  return (
    <>
      <button
        className="btn rounded bg-tea hover:bg-rose-400 text-white"
        onClick={isApplied ? startTeatime : applyTeatime}
        disabled={checkDisableButton()}
      >
        {isApplied ? '티타임 시작하기' : '티타임 참여하기'}
      </button>
      <form action="">
        <label htmlFor="">이름</label>
        <input type="text" />
        <label htmlFor="">휴대전화</label>
        <input type="tel" />
        <label htmlFor="">주소</label>
        <input type="text" />
      </form>
    </>
  );
}
