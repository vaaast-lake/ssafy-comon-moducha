import { ShareListItem } from '../../../types/ShareType';
import { Link } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/16/solid';

const ShareListCard = ({ boardId, title, content }: ShareListItem) => {
  return (
    <Link
      to={`shares/${boardId}`}
      className="flex flex-col gap-3 rounded group/sharecard duration-300 delay-50 transition ease-in-out hover:text-tea"
    >
      <figure
        className="overflow-hidden rounded border h-32 bg-cover bg-no-repeat bg-center duration-300 delay-50 transition ease-in-out group-hover/sharecard:scale-105"
        style={{
          backgroundImage: `url(/mock/maincard/share${boardId}.png)`,
        }}
      ></figure>
      <main className="flex flex-col gap-1">
        <header className="flex items-center gap-1">
          <h1 className="truncate font-semibold">{title}</h1>
        </header>
        <article>
          <p className="line-clamp-2 text-sm text-disabled">{content}</p>
        </article>
        <footer className="flex items-center text-sm gap-0.5 text-gray-400">
          <HeartIcon className="size-5 text-error" />
          <span>12</span>
        </footer>
      </main>
    </Link>
  );
};

export default ShareListCard;
