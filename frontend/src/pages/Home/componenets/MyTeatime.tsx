import { useState } from 'react';
import { Link } from 'react-router-dom';
import { genMockList } from '../../../constants/teatimeMock';
import MyTeatimeCard from './MyTeatimeCard';

const MyTeatime = ({ ...props }) => {
  const [myTeatimeList, setMyTeatime] = useState(genMockList(4));
  return (
    <section {...props}>
      <header className="flex justify-between items-center">
        <h1 className="font-semibold text-2xl">나의 티타임</h1>
        <Link to={'teatimes'} className="text-disabled">
          모두보기
        </Link>
      </header>
      <article className="grid grid-cols-2 lg:grid-cols-4 items-center gap-4">
        {myTeatimeList.map((el) => (
          <MyTeatimeCard key={el.boardId} {...el} />
        ))}
      </article>
    </section>
  );
};

export default MyTeatime;
