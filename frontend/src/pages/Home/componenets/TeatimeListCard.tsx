import { Link } from 'react-router-dom';
import { TeatimeListItem } from '../../../types/TeatimeType';

const TeatimeListCard = ({ boardId, title, content }: TeatimeListItem) => {
  return (
    <Link
      to={`/teatimes/${boardId}`}
      className="flex flex-col overflow-hidden border rounded-lg transition ease-in-out hover:bg-teabg hover:shadow-lg duration-150"
    >
      <figure
        className="overflow-hidden h-40 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(/mock/maincard/tea${boardId}.jpg)` }}
      ></figure>
      <main className="p-4 pt-2">
        <header className="font-semibold">{title}</header>
        <p className="text-sm line-clamp-2 text-disabled">{content}</p>
        <footer className="flex gap-1 text-sm text-tea mt-1 antialiased truncate">
          <span>#나눔</span>
          <span>#세션</span>
          <span>#나눔</span>
          <span>#나눔</span>
        </footer>
      </main>
    </Link>
  );
};

export default TeatimeListCard;
