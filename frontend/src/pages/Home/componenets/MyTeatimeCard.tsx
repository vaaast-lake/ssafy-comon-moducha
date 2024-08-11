import { Link } from 'react-router-dom';
import Badge from '../../../components/Badge/Badge';
import { TeatimeListItem } from '../../../types/TeatimeType';
const MyTeatimeCard = ({ boardId, title, content }: TeatimeListItem) => {
  return (
    <Link
      to={`teatimes/${boardId}`}
      className="flex flex-col gap-3 rounded group/myteatime duration-300 delay-50 transition ease-in-out hover:text-tea"
    >
      <figure
        className="overflow-hidden rounded border h-32 bg-cover bg-no-repeat bg-center duration-300 delay-50 transition ease-in-out group-hover/myteatime:scale-105"
        style={{
          backgroundImage: `url(/mock/maincard/my${(boardId % 4) + 1}.png)`,
        }}
      ></figure>
      <main className="flex flex-col gap-1">
        <header className="flex items-center gap-1">
          <Badge color="red">진행</Badge>
          <h1 className="truncate font-semibold">{title}</h1>
        </header>
        <article>
          <p className="line-clamp-2 text-sm text-disabled">{content}</p>
        </article>
      </main>
    </Link>
  );
};

export default MyTeatimeCard;
