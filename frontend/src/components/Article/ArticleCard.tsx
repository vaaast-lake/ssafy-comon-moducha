import useAuthStore from '../../stores/authStore';
import { ArticleDetail } from '../../types/ArticleType';
import dateParser from '../../utils/dateParser';
const ArticleCard = ({
  boardType,
  nickname,
  createdDate,
  endDate,
  broadcastDate,
  participants,
  maxParticipants,
}: ArticleDetail) => {
  const shareHandler = () => {};
  const teatimeHandler = () => {};
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
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
      {isLoggedIn && (
        <button
          onClick={boardType === 'shares' ? shareHandler : teatimeHandler}
          className="btn rounded bg-tea hover:bg-rose-400 text-white"
        >
          {boardType === 'shares' ? '나눔 참여하기' : '티타임 참여하기'}
        </button>
      )}
    </div>
  );
};

export default ArticleCard;
