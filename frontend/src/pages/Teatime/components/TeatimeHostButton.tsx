import { useTeatime } from '../../../hooks/useTeatime';

interface TeatimeHostButtonProps {
  boardType: string;
  title: string;
}

export default function TeatimeHostButton({
  boardType,
  title,
}: TeatimeHostButtonProps) {
  const { startTeatime } = useTeatime(boardType, title);
  return (
    <button
      className="btn rounded bg-tea hover:bg-rose-400 text-white"
      onClick={startTeatime}
    >
      티타임 시작하기
    </button>
  );
}
