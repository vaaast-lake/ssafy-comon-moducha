import { useState } from 'react';
import { Link } from 'react-router-dom';
import { genShareListItems } from '../../../constants/shareResponseTest';
import ShareListCard from './ShareListCard';
const ShareList = ({ ...props }) => {
  const [shareList, setShareList] = useState(genShareListItems(4));
  return (
    <section {...props}>
      <header className="flex justify-between items-center">
        <h1 className="font-semibold text-2xl">나눔 목록</h1>
        <Link to={'shares'} className="text-disabled">
          모두보기
        </Link>
      </header>
      <article className="grid grid-cols-2 lg:grid-cols-4 items-center gap-4">
        {shareList.map((el) => (
          <ShareListCard key={el.boardId} {...el} />
        ))}
      </article>
    </section>
  );
};

export default ShareList;
