import { ShareDetailItem } from '../../types/ShareType';
import dateParser from '../../utils/dateParser';
const ArticleCard = ({
  nickName,
  createdDate,
  endDate,
  viewCount,
  participants,
  maxParticipants,
}: ShareDetailItem) => {
  return (
    <div className="md:sticky md:top-2 flex flex-col p-2 overflow-clip rounded-lg shadow gap-4">
      <figure
        className="bg-contain bg-center bg-no-repeat h-48"
        style={{ backgroundImage: `url(/logo.png)` }}
      />
      <div id="card-body">
        <header>
          <div className="flex gap-1">
            <span>{nickName}</span>|<span>조회 {viewCount}</span>
          </div>
        </header>
        <div className="pl-0 flex flex-col">
          <span>작성 : {dateParser(createdDate)}</span>
          <span>신청 : {participants + ' / ' + maxParticipants}</span>
          <span id="share-end_date">마감 : {dateParser(endDate)}</span>
        </div>
      </div>
      <button className="btn bg-success hover:bg-rose-500 text-white">
        나눔 참여하기
      </button>
    </div>
  );
};

export default ArticleCard;
