import { TeatimeListItem } from '../../../types/TeatimeType';
import { Link } from 'react-router-dom';
import Badge from '../../../components/Badge/Badge';
import teaimage from '/mock/mocktea.png';

const TeatimeCard = ({
  userId,
  boardId,
  title,
  content,
  createdDate,
}: TeatimeListItem) => {
  return (
    <Link
      to={`${boardId}`}
      className="flex flex-col p-5 border gap-3 bg-base-100 overflow-hidden shadow rounded-lg transition ease-in-out hover:bg-teabg hover:shadow-lg duration-150"
    >
      <header className="flex justify-between">
        <figure className="shrink-0">
          <img className="size-20 rounded-xl" src={teaimage} alt="Album" />
        </figure>
        <div className="flex tag-region gap-1 shrink-0">
          <Badge color="red">나눔</Badge>
          <Badge color="yellow">나눔</Badge>
          <Badge color="green">나눔</Badge>
          <Badge color="blue">나눔</Badge>
        </div>
      </header>
      <article className="flex flex-col w-full overflow-hidden">
        <h2 className="font-bold truncate">{title}</h2>
        <p className="text-disabled truncate">{content}</p>
        <section className="flex items-center gap-2"></section>
      </article>
    </Link>
  );
};

export default TeatimeCard;
