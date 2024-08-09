import { Comment, CommentReplyType } from '../../types/CommentType';
import { BoardType } from '../../types/BoardType';
import avatarUrl from '../../assets/avatar/test_avatar.png';
import dateParser from '../../utils/dateParser';
import CommentReply from './CommentReply';
import axiosInstance from '../../api/axiosInstance';
import { Dispatch, SetStateAction, useState } from 'react';

interface CommentListType extends Comment {
  commentType: CommentReplyType;
  boardType: BoardType;
  isLoggedIn?: boolean;
  currentUserId: string;
  setCommentList: Dispatch<SetStateAction<Comment[]>>;
}

const CommentListItem = ({
  commentType,
  boardType,
  nickname,
  content,
  createdDate,
  boardId,
  commentId,
  replyId,
  replyCount,
  userId,
  isLoggedIn,
  currentUserId,
  setCommentList,
}: CommentListType) => {
  const [isReplyWrite, setIsReplyWrite] = useState(false);
  const handleDelete = () => {
    const BASE_URL = `${boardType}/${boardId}`;
    const DELETE_URL =
      commentType === 'comment'
        ? `${BASE_URL}/deactivated-comments/${commentId}`
        : `${BASE_URL}/comments/${commentId}/deactivated-replies/${replyId}`;

    axiosInstance.patch(DELETE_URL).then(() => {
      if (commentType === 'comment') {
        setIsReplyWrite(() => false);
      }
      setCommentList((prev) =>
        // 댓글 삭제가 서버에서 성공하면 댓글 배열 순회하며 업데이트
        prev.map((el) => {
          const removeComment = (item: Comment) => {
            item.nickname = '';
            item.content = '삭제된 댓글입니다.';
          };
          if (commentType === 'comment' && el.commentId === commentId)
            removeComment(el);
          if (commentType === 'reply' && el.replyId === replyId)
            removeComment(el);

          return el;
        })
      );
    });
  };

  return (
    <>
      <div className="flex py-4">
        <figure id="cmt-thumb" className="w-1/12">
          <img src={avatarUrl} alt="" />
        </figure>
        <main className="w-11/12 px-2 flex flex-col justify-between">
          <header className="flex justify-between">
            <span className="font-bold">{nickname}</span>
          </header>
          <article>
            <p className="pe-4">{content}</p>
          </article>
          <footer className="mt-2 text-sm text-gray-500 font-light flex gap-2">
            <span>{dateParser(createdDate)}</span>
            <div className="flex gap-1">
              {!!nickname && commentType === 'comment' && isLoggedIn && (
                <button
                  onClick={() => setIsReplyWrite((prev) => !prev)}
                  className="font-medium text-gray-600"
                >
                  답글
                </button>
              )}
              {userId === currentUserId && nickname && (
                <>
                  ·
                  <button
                    onClick={handleDelete}
                    className="font-medium text-gray-600"
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          </footer>
        </main>
      </div>
      {commentType === 'comment' && (
        <>
          <CommentReply
            {...{
              isReplyWrite,
              commentType,
              boardType,
              boardId,
              commentId,
              replyCount,
              currentUserId,
            }}
          />
          <hr />
        </>
      )}
    </>
  );
};

export default CommentListItem;
