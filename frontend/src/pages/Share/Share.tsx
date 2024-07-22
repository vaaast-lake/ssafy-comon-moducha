import ShareCard from './components/ShareCard';
import ShareSearch from './components/ShareSearch';
import ShareTitle from './components/ShareTitle';
import Pagination from '../../components/Pagination/Pagination';
import { useShareStore } from '../../stores/shareStore';
import { useState } from 'react';

const ShareCardList = () => {
  const ShareCardArray = [];
  for (let i = 0; i < 8; i++) {
    ShareCardArray.push(<ShareCard key={`nanum_${i}`} />);
  }
  return ShareCardArray;
};

const Share = () => {
  const { shareList, fetchShareList } = useShareStore();
  console.log(shareList);
  fetchShareList();
  const pageObj = {
    limit: 10,
    currentPage: 5,
  };

  return (
    <div className="flex h-full justify-center m-5">
      <aside></aside>

      <main id="nanum-body" className="flex flex-col gap-4">
        <header>
          <ShareTitle />
          <div className="divider"></div>
          <div className='flex justify-between'>
            <ShareSearch />
          </div>
        </header>

        <section id="nanum-list" className="grid gap-4 xl:grid-cols-2">
          <ShareCardList />
        </section>

        <footer className="flex justify-center">
          <Pagination {...pageObj} />
        </footer>
      </main>

      <aside></aside>
    </div>
  );
};

export default Share;
