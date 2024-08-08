import { ShareDetailItem } from '../../types/ShareType';
import { EVDown, EVDownItem, EVDownMenu } from '../Dropdown/EllipsisDropdown';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import useAuthStore from '../../stores/authStore';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { BoardType } from '../../types/BoardType';
interface ArticleProp extends ShareDetailItem {
  children?: React.ReactNode;
  boardType: BoardType;
}
const ArticleContent = ({
  boardType,
  title,
  boardId,
  content,
  children,
  userId,
}: ArticleProp) => {
  const currentUserId = useAuthStore((state) => state.currentUserId);
  const navigate = useNavigate();
  const handleDelete = () => {
    axiosInstance
      .patch(`/${boardType}/deactivated-${boardType}/${boardId}`)
      .then(() => {
        navigate(`/${boardType}`);
      });
  };
  const handleUpdate = () => {};

  return (
    <div className="p-4 shadow border flex flex-col gap-4">
      <header className="flex  justify-between items-center border rounded p-4 pr-1 shadow-md">
        <h1 className="text-2xl font-semibold text-wood truncate">{title}</h1>
        {currentUserId === userId && (
          <DropdownMenu
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
          />
        )}
      </header>
      <article>
        {/* <ArticleCarousel banners={testImageList} /> */}
        {/* content -> HTML 태그로 렌더링 */}
        <p dangerouslySetInnerHTML={{ __html: content }} className="my-4"></p>
        <hr />
      </article>
      <section>{children}</section>
    </div>
  );
};

interface Dropdown {
  handleDelete: () => void;
  handleUpdate: () => void;
}

const DropdownMenu = ({ handleDelete, handleUpdate }: Dropdown) => (
  <EVDown>
    <EVDownMenu className="w-24">
      <EVDownItem onClick={handleUpdate} className="p-2">
        <PencilIcon className="size-5" />
        <span>수정</span>
      </EVDownItem>
      <EVDownItem onClick={handleDelete} className="p-2">
        <TrashIcon className="size-5" />
        삭제
      </EVDownItem>
    </EVDownMenu>
  </EVDown>
);

export default ArticleContent;
