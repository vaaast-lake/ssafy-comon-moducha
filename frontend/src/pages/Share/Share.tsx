import ShareCard from './components/ShareCard';
import ShareHeader from './components/ShareHeader';
import TitleCard from '../../components/Title/TitleCard';
import Pagination from '../../components/Pagination/Pagination';
import { useShareStore } from '../../stores/shareStore';
import { ShareItem } from '../../types/ShareItem';
import axiosInstance from '../../api/axios';
import { useEffect } from 'react';
import shareResponse from '../../constants/shareResponseTest';

const fetchShareList = async (setShareList: (data: ShareItem[]) => void) => {
  const response = await axiosInstance.get('/shares');
  setShareList(response.data);
};

const Share = () => {
  const { shareList, setShareList } = useShareStore();

  useEffect(() => {
    // fetchShareList(setShareList);
    setShareList(shareResponse);
  }, []);

  const pageObj = {
    limit: 10,
    currentPage: 5,
  };

  return (
    <div className="flex justify-center m-5">
      {/* 좌측 사이드바 영역 */}
      <aside className="lg:w-1/5"></aside>

      <main id="share-body" className="lg:w-3/5 flex flex-col gap-4">
        <header>
          <TitleCard title="나눔" />
          <div className="divider"></div>
          <div className="flex justify-between">
            <ShareHeader />
          </div>
        </header>

        <section
          id="share-list"
          className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3"
        >
          <ShareCardList shareItems={shareList} />
        </section>

        <footer className="flex justify-center">
          <Pagination {...pageObj} />
        </footer>
      </main>
      {/* 우측 사이드바 영역 */}
      <aside className="lg:w-1/5"></aside>
    </div>
  );
};

export default Share;

const ShareCardList = ({ shareItems }: { shareItems: ShareItem[] }) => {
  return shareItems.map((shareItem) => (
    <ShareCard key={shareItem.shareBoardId} {...shareItem} />
  ));
};
