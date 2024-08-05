import { ShareListItem } from '../../../types/ShareType';
import { Link } from 'react-router-dom';

const ShareListCard = ({ boardId, title, content }: ShareListItem) => {
  return (
    <Link to={`shares/${boardId}`} className="flex flex-col gap-3 rounded">
      <figure
        className="overflow-hidden rounded border h-32 bg-cover bg-no-repeat bg-center"
        style={{
          backgroundImage: `url(/mock/maincard/share${boardId + 1}.png)`,
        }}
      ></figure>
      <main className="flex flex-col gap-1">
        <header className="flex items-center gap-1">
          <h1 className="truncate font-semibold">{title}</h1>
        </header>
        <article>
          <p className="line-clamp-2 text-sm text-disabled">{content}</p>
        </article>
      </main>
    </Link>
  );
};

export default ShareListCard;
