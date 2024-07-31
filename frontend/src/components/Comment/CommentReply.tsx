import { useEffect, useState } from 'react';
import mockReply from '../../constants/shareReplyResponseTest.json';
import CommentListItem from './CommentListItem';
import { fetchReplyList } from '../../api/fetchComment';
import { BoardType } from '../../types/BoardType';

interface CommentInfo {
  boardId?: number;
  commentId: number;
  replyCount?: number;
}

const CommentReply = (prop: {
  boardType: BoardType;
  commentInfo: CommentInfo;
}) => {
  const { boardId, commentId, replyCount } = prop.commentInfo;
  const defaultParams = {
    boardType: prop.boardType,
    boardId,
    commentId,
    page: 1,
    perPage: 10,
  };

  const [fetchParams, setFetchParams] = useState(defaultParams);
  const [replyList, setReplyList] = useState(mockReply.data);
  useEffect(() => {
    // 재귀호출된 경우 fetch 방지
    if (boardId) {
      fetchReplyList(fetchParams).then((res) => setReplyList(res.data));
    }
  });

  if (!replyCount) return null;
  return (
    <div id="reply-list">
      <div>
        {replyList.map((el) => (
          <ul key={el.replyId} className="grid grid-cols-12">
            <div className="col-span-1 relative">
              <div className="after:div after:border-l-2 after:border-b-2  after:rounded-sm after:border-slate-300 after:w-1/3 after:h-1/4 after:absolute after:right-2 after:top-2"></div>
            </div>
            <div className="col-span-11">
              <hr />
              <CommentListItem boardType={prop.boardType} commentItem={el} />
            </div>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default CommentReply;
