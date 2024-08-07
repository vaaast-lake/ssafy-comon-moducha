import { Dispatch, SetStateAction, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { BoardType } from '../../types/BoardType';
import { Comment } from '../../types/CommentType';
import useAuthStore from '../../stores/authStore';

interface CommentWriteType {
  boardType: BoardType;
  boardId: number;
  hasComments: boolean;
  setHasComments: Dispatch<SetStateAction<boolean>>;
  setCommentList: Dispatch<SetStateAction<Comment[]>>;
}

const CommentWrite = ({
  boardType,
  boardId,
  hasComments,
  setHasComments,
  setCommentList,
}: CommentWriteType) => {
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSending(() => true);
    axiosInstance
      .post(`${boardType}/${boardId}/comments`, {
        content,
      })
      .then((res) => {
        setCommentList((prev) => [...prev, res.data.data]);
        handleDelete();
        if (!hasComments) {
          setHasComments(() => true);
        }
      })
      .catch((err) => {
        alert('댓글 작성 중 에러가 발생했습니다.');
        return err;
      })
      .finally(() => {
        setIsSending(() => false);
      });
  };
  const handleDelete = () => {
    setContent(() => '');
  };

  if (!isLoggedIn) return null;
  return (
    <form onSubmit={handleSubmit} className="flex py-4">
      <textarea
        className="w-full border p-4 resize-none focus:outline-none focus:border-tea focus:ring-tea"
        name="content"
        placeholder="댓글을 작성해 보세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <div className="w-24 flex flex-col px-2 gap-2">
        <button
          type="submit"
          className="btn rounded bg-teabg text-tea hover:bg-tea hover:text-white"
          disabled={isSending}
        >
          작성
        </button>
        <button
          onClick={handleDelete}
          type="button"
          className="btn rounded bg-teabg text-tea hover:bg-tea hover:text-white"
          disabled={isSending}
        >
          삭제
        </button>
      </div>
    </form>
  );
};

export default CommentWrite;
