import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { genMockList } from '../../../constants/teatimeMock';
import MyTeatimeCarousel from './MyTeatimeCarousel';

const MyTeatime = ({ ...props }) => {
  const [myTeatimeList, setMyTeatime] = useState(genMockList(12));
  useEffect(() => {});
  return (
    <section {...props}>
      <header className="flex justify-between items-center">
        <h1 className="font-semibold text-2xl">나의 티타임</h1>
        <Link to={'teatimes'} className="text-disabled">
          모두보기
        </Link>
      </header>
      <main className="relative">
        <MyTeatimeCarousel myTeatimeList={myTeatimeList} />
      </main>
    </section>
  );
};

export default MyTeatime;
