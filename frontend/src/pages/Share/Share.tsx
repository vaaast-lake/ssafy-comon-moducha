import ShareCard from './components/ShareCard';
import ShareSearch from './components/ShareSearch';
import Pagination from '../../components/Pagination/Pagination';
import { useShareStore } from '../../stores/shareStore';

const ShareCardList = () => {
  const ShareCardArray = [];
  for (let i = 0; i < 8; i++) {
    ShareCardArray.push(<ShareCard key={`nanum_${i}`} />);
  }
  return ShareCardArray;
};

const Share = () => {
  const pageObj = {
    limit: 10,
    currentPage: 5,
  };

  return (
    <div className="flex h-full justify-center m-5">
      <aside></aside>

      <main id="nanum-body" className="flex flex-col gap-4">
        <header>
          <div className="flex justify-between bg-base-100 min-w-80 p-4 shadow-lg bg-base-100 rounded-lg">
            <div className="text-3xl font-bold text-tea my-auto">나눔</div>
          </div>
          <div className="divider"></div>
          <div className="flex justify-end">
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
