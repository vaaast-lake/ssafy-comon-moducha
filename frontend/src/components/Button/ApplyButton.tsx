import { BoardType } from '../../types/BoardType';
import ApplyModal from '../Modal/ApplyModal';

const ApplyButton = ({
  isEnded,
  isLoggedIn,
  boardId,
  boardType,
}: {
  isEnded: boolean;
  isLoggedIn: boolean;
  boardId: number;
  boardType: BoardType;
}) => {
  const boardName = boardType === 'teatimes' ? '티타임' : '나눔';
  if (!isLoggedIn) {
    return (
      <button className="btn rounded-sm disabled:text-white" disabled>
        참여하려면 로그인하세요
      </button>
    );
  }
  return (
    <>
      <button
        onClick={() =>
          (
            document.getElementById('apply_modal') as HTMLDialogElement
          )?.showModal()
        }
        className={`btn rounded-sm font-bold bg-green-400 hover:bg-green-600 text-white ${
          isEnded && 'disabled:text-white'
        }`}
        disabled={isEnded}
      >
        {isEnded ? '마감되었습니다' : `${boardName} 신청하기`}
      </button>
      {!isEnded && <ApplyModal {...{ boardType, boardId }} />}
    </>
  );
};

export default ApplyButton;
