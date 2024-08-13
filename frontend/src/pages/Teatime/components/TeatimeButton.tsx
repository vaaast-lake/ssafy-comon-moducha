import useAuthStore from '../../../stores/authStore';
import TeatimeHostButton from './TeatimeHostButton';
import TeatimeParticipantButton from './TeatimeParticipantButton';

interface TeatimeButtonProps {
  title: string;
  boardType: string;
  nickname: string;
}

export default function TeatimeButton({
  title,
  boardType,
  nickname,
}: TeatimeButtonProps) {
  const { userName } = useAuthStore((state) => ({
    userName: state.currentUsername,
  }));
  return nickname === userName ? (
    <TeatimeHostButton boardType={boardType} title={title} />
  ) : (
    <TeatimeParticipantButton boardType={boardType} title={title} />
  );
}
