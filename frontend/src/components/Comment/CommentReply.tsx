import { useEffect, useState } from 'react';
import CommentListItem from './CommentListItem';
import { fetchReplyList } from '../../api/fetchComment';
import { BoardType } from '../../types/BoardType';
import { Comment } from '../../types/CommentType';

interface ReplyType {
  boardType: BoardType;
  boardId?: number;
  commentId: number;
  replyCount?: number;
  currentUserId: string;
}

const CommentReply = ({
  boardType,
  commentId,
  boardId,
  currentUserId,
}: ReplyType) => {
  const [replyList, setReplyList] = useState<Comment[]>([]);
  const [fetchParams, setFetchParams] = useState({
    boardType: boardType,
    boardId,
    commentId,
    page: 1,
    perPage: 10,
  });
  useEffect(() => {
    // 재귀호출된 경우 fetch 방지
    fetchReplyList(fetchParams).then((res) => setReplyList(res.data));
  });
  if (!replyList) return null;
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
              <CommentListItem
                setCommentList={setReplyList}
                {...{ ...el, type: 'reply', boardType, currentUserId }}
              />
            </div>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default CommentReply;
