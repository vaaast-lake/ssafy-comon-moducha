import { ShareListItem } from '../../../types/ShareType';
import { UserIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const ShareCard = ({
  boardId,
  title,
  maxParticipants,
  participants,
  viewCount,
}: ShareListItem) => {
  return (
    <Link
      to={`${boardId}`}
      className="flex bg-base-100 overflow-hidden shadow rounded-lg transition ease-in-out hover:bg-teabg hover:shadow-lg duration-150"
    >
      <figure className="size-32 shrink-0">
        <img
          className=""
          src="https://the-chinese-tea-company.com/cdn/shop/files/Loose_Leaf_Tea_1600x.jpg?v=1613558529"
          alt="Album"
        />
      </figure>
      <article className="flex flex-col w-full p-2 h-32 overflow-hidden">
        <h2 className="font-bold truncate">{title}</h2>
        <section className="flex items-center gap-3">
          <div>
            <UserIcon className="inline size-4" />
            <span className="text-sm">
              {participants} / {maxParticipants}
            </span>
          </div>
          <div>
            <EyeIcon className="inline size-4" />
            <span className="text-sm ms-1">{viewCount}</span>
          </div>
        </section>
      </article>
    </Link>
  );
};

export default ShareCard;
