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
  const { teatimeToken, isLogin } = useAuthStore((state) => ({
    teatimeToken: state.teatimeToken,
    isLogin: state.isLoggedIn
  }));
  const { applyTeatime, joinTeatime, teatimeIsOpen } = useTeatime(boardType, title);
  const isOpen = teatimeIsOpen();

  return (
    <button
      className="btn rounded bg-tea hover:bg-rose-400 text-white"
      onClick={teatimeToken ? joinTeatime : applyTeatime}
      disabled={!isLogin || !isOpen}
    >
      {teatimeToken ? '티타임 시작하기' : '티타임 참여하기'}
    </button>
  );
}
