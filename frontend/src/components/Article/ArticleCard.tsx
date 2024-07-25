import { ShareDetailItem } from '../../types/ShareType';
const ArticleCard = ({
  title,
  content,
  nickname,
  createdDate,
  endDate,
  viewCount,
  participants,
  maxParticipants,
}: ShareDetailItem) => {
  return (
    <div className="card p-2 overflow-clip shadow-md">
      <figure
        className="bg-contain bg-center bg-no-repeat h-48"
        style={{ backgroundImage: `url(/logo.png)` }}
      />
      <div id="card-body">
        <header>
          <h5 className="card-title">{title}</h5>
          <div className="flex gap-1">
            <span>{nickname}</span>|<span>조회 {viewCount}</span>|
            <span>{createdDate}</span>
          </div>
        </header>
        <div className="card-body pl-0">
          <span>신청 : {participants + ' / ' + maxParticipants}</span>
          <span id="share-end_date">기간 : {endDate}</span>
          <span>{content}</span>
        </div>
      </div>
      <button className="btn bg-rose-300 hover:bg-rose-400 text-white">
        나눔 신청하기
      </button>
    </div>
  );
};

export default ArticleCard;
