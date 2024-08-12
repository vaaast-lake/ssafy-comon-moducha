import TeatimeHostButton from './TeatimeHostButton';
import TeatimeParticipantButton from './TeatimeParticipantButton';

interface TeatimeButtonProps {
  title: string;
  boardType: string;
  nickname: string;
  userName: string;
}

export default function TeatimeButton({
  title,
  boardType,
  nickname,
  userName,
}: TeatimeButtonProps) {
  return nickname === userName ? (
    <TeatimeHostButton boardType={boardType} title={title} />
  ) : (
    <TeatimeParticipantButton boardType={boardType} title={title} />
  );
}
