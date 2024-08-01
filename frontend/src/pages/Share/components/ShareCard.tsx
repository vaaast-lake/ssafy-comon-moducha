import { ShareListItem } from '../../../types/ShareType';
import { HiEye, HiUsers } from "react-icons/hi";
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
        <section className="flex items-center gap-2">
          <div>
            <HiUsers className="inline size-4 text-green-500" />
            <span className="text-sm ms-1">
              {participants} / {maxParticipants}
            </span>
          </div>
          <div>
            <HiEye className="inline size-4 text-orange-500" />
            <span className="text-sm ms-1">{viewCount}</span>
          </div>
        </section>
      </article>
    </Link>
  );
};

export default ShareCard;
