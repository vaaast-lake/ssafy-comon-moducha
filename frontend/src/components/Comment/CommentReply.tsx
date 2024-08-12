import { useEffect, useState } from 'react';
import CommentListItem from './CommentListItem';
import { fetchReplyList } from '../../api/fetchComment';
import { BoardType } from '../../types/BoardType';
import { Comment, CommentReplyType } from '../../types/CommentType';
import CommentReplyWrite from './CommentReplyWrite';

interface ReplyType {
  isReplyWrite: boolean;
  commentType: CommentReplyType;
  boardType: BoardType;
  boardId: number;
  commentId: number;
  replyCount?: number;
  currentUserId: string;
}

const CommentReply = ({
  isReplyWrite,
  boardType,
  boardId,
  commentId,
  currentUserId,
}: ReplyType) => {
  const [replyList, setReplyList] = useState<Comment[]>([]);

  useEffect(() => {
    fetchReplyList({
      boardType: boardType,
      boardId,
      commentId,
      page: 1,
      perPage: 10,
    }).then((res) => {
      if (res.status === 200) {
        setReplyList(res.data.data);
      }
    });
  }, []);

  return (
    <ul id="reply-list">
      {isReplyWrite && (
        <CommentReplyWrite
          {...{ boardId, boardType, commentId, setReplyList }}
        />
      )}
      {replyList.map((el) => (
        <li key={el.replyId} className="grid grid-cols-12">
          <div className="col-span-1 relative">
            <div className="after:div after:border-l-2 after:border-b-2 after:rounded-sm after:border-slate-300 after:w-1/3 after:h-1/4 after:absolute after:right-2 after:top-2"></div>
          </div>
          <div className="col-span-11">
            <hr />
            <CommentListItem
              setCommentList={setReplyList}
              {...{
                ...el,
                commentType: 'reply',
                boardType,
                boardId,
                currentUserId,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CommentReply;
