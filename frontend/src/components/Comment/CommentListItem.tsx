import { Comment } from '../../types/CommentType';
import { BoardType } from '../../types/BoardType';
import avatarUrl from '../../assets/avatar/test_avatar.png';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import dateParser from '../../utils/dateParser';
import CommentReply from './CommentReply';

const CommentListItem = (prop: {
  boardType: BoardType;
  commentItem: Comment;
}) => {
  const {
    replyId,
    nickname,
    content,
    createdDate,
    boardId,
    commentId,
    replyCount,
  } = prop.commentItem;
  return (
    <li>
      <div id="cmt-item" className="flex py-4">
        <figure id="cmt-thumb" className="w-1/12">
          <img src={avatarUrl} alt="" />
        </figure>
        <main
          id="cmt-content"
          className="w-11/12 px-2 flex flex-col justify-between"
        >
          <header className="flex justify-between">
            <span className="font-bold">{nickname}</span>
            <div className="dropdown dropdown-end">
              <button
                tabIndex={0}
                role="button"
                className="size-6 text-gray-500 rounded-full hover:bg-gray-100 focus:bg-gray-100"
              >
                <EllipsisVerticalIcon />
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-20 drop-shadow"
              >
                <li>
                  <a>삭제</a>
                </li>
              </ul>
            </div>
          </header>
          <article>
            <p className="pe-4">{content}</p>
          </article>
          <footer className="mt-2 text-sm text-gray-500 font-light">
            <span>{dateParser(createdDate)}</span>
            {boardId && (
              <button className="ml-2 font-medium text-gray-600">답글</button>
            )}
          </footer>
        </main>
      </div>
      <CommentReply
        boardType={prop.boardType}
        commentInfo={{ boardId, commentId, replyCount }}
      />
      {!!boardId && <hr />}
    </li>
  );
};

export default CommentListItem;
