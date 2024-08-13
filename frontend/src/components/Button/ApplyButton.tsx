import useAuthStore from '../../stores/authStore';
import { BoardType } from '../../types/BoardType';
import ApplicantModal from '../Modal/ApplicantModal';
import ApplyModal from '../Modal/ApplyModal';

const ApplyButton = ({
  isEnded,
  boardId,
  boardType,
  userId,
}: {
  isEnded: boolean;
  boardId: number;
  boardType: BoardType;
  userId: string;
}) => {
  const { isLoggedIn, currentUserId } = useAuthStore((state) => ({
    isLoggedIn: state.isLoggedIn,
    currentUserId: state.currentUserId,
  }));
  const boardName = boardType === 'teatimes' ? '티타임' : '나눔';
  console.log(userId, currentUserId);

  if (!isLoggedIn) {
    return (
      <button className="btn rounded-sm disabled:text-white" disabled>
        참여하려면 로그인하세요
      </button>
    );
  } else if (userId === currentUserId) {
    // 작성자 본인인 경우 참여자 리스트 확인하기
    return (
      <>
        <button
          onClick={() =>
            (
              document.getElementById('applicant_modal') as HTMLDialogElement
            )?.showModal()
          }
          className="btn rounded-sm font-bold bg-green-400 hover:bg-green-600 text-white"
        >
          참여자 확인하기
        </button>
        <ApplicantModal {...{ boardType, boardId }} />
      </>
    );
  } else
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
