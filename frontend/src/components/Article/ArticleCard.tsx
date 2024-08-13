import { ArticleDetail } from '../../types/ArticleType';
import dateParser from '../../utils/dateParser';
import TeatimeButton from '../../pages/Teatime/components/TeatimeButton';
import ApplyModal from '../Modal/ApplyModal';
const ArticleCard = ({
  title,
  boardType,
  boardId,
  nickname,
  createdDate,
  endDate,
  broadcastDate,
  participants,
  maxParticipants,
}: ArticleDetail) => {
  return (
    <div className="md:sticky md:top-2 flex flex-col overflow-clip p-4 border shadow gap-4">
      <figure
        className="bg-contain bg-center bg-no-repeat h-48"
        style={{ backgroundImage: `url(/logo.png)` }}
      />
      <div id="card-body" className="text-disabled">
        <header>
          <div className="flex gap-1">
            <span>{nickname}</span>
          </div>
        </header>
        <div className="pl-0 flex flex-col">
          <span>작성 : {dateParser(createdDate)}</span>
          <span>마감 : {dateParser(endDate)}</span>
          <span>참여 : {participants + ' / ' + maxParticipants}</span>
          {boardType === 'teatimes' && (
            <span>예정 : {dateParser(broadcastDate)}</span>
          )}
        </div>
      </div>
      {boardType === 'shares' ? (
        <>
          <button
            onClick={() =>
              (
                document.getElementById('apply_modal') as HTMLDialogElement
              )?.showModal()
            }
            className="btn rounded-sm font-bold bg-green-500 hover:bg-green-600 text-white"
          >
            나눔 참여하기
          </button>
          <ApplyModal {...{ boardType, boardId }} />
        </>
      ) : (
        <TeatimeButton
          title={title}
          boardType={boardType}
          nickname={nickname}
        />
      )}
    </div>
  );
};

export default ArticleCard;
