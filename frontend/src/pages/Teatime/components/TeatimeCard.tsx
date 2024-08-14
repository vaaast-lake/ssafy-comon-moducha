import { TeatimeListItem } from '../../../types/TeatimeType';
import { Link } from 'react-router-dom';
import OutlineBadge from '../../../components/Badge/OutlineBadge';
import { parse } from 'node-html-parser';
import defaultTeatime from '../../../assets/defaultcard/defaultTeatime.jpg';

const TeatimeCard = ({ boardId, title, content }: TeatimeListItem) => {
  const parsedContent = parse(content);
  const imageUrl = parsedContent.querySelector('img')?.getAttribute('src');

  return (
    <Link
      to={`${boardId}`}
      className="flex flex-col p-5 border gap-3 bg-base-100 overflow-hidden shadow rounded-lg transition ease-in-out hover:bg-teabg hover:shadow-lg duration-150"
    >
      <header className="flex justify-between">
        <figure
          className="shrink-0 size-20 rounded-xl bg-cover bg-no-repeat bg-center"
          style={{
            backgroundImage: `url(${imageUrl ? imageUrl : defaultTeatime})`,
          }}
        />

        <div className="flex tag-region gap-1 shrink-0">
          <OutlineBadge color="red">나눔</OutlineBadge>
          <OutlineBadge color="yellow">나눔</OutlineBadge>
          <OutlineBadge color="green">나눔</OutlineBadge>
          <OutlineBadge color="blue">나눔</OutlineBadge>
        </div>
      </header>
      <article className="flex flex-col w-full overflow-hidden">
        <h2 className="font-bold truncate">{title}</h2>
        <p className="text-disabled truncate">{parsedContent.textContent}</p>
        <section className="flex items-center gap-2"></section>
      </article>
    </Link>
  );
};

export default TeatimeCard;
