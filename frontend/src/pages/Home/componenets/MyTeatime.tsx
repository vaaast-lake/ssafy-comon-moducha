import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MyTeatimeCarousel from './MyTeatimeCarousel';
import { TeatimeListItem } from '../../../types/TeatimeType';
import { fetchMyParticipatedList } from '../../../api/fetchArticle';
import useAuthStore from '../../../stores/authStore';
import NotFound from './NotFound';

const MyTeatime = ({ ...props }) => {
  const [myTeatimeList, setMyTeatime] = useState<TeatimeListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useAuthStore((state) => ({ userId: state.currentUserId }));
  useEffect(() => {
    fetchMyParticipatedList({ userId, boardType: 'teatimes' })
      .then((res) => {
        setMyTeatime(res.data.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }, [userId]);
  return (
    <section {...props}>
      <header className="flex justify-between items-center">
        <h1 className="font-semibold text-2xl">나의 티타임</h1>
        <Link to={'teatimes'} className="text-disabled">
          모두보기
        </Link>
      </header>
      <main className="relative">
        {!isLoading && !myTeatimeList.length && <NotFound />}
        {!isLoading && !!myTeatimeList.length && (
          <MyTeatimeCarousel myTeatimeList={myTeatimeList} />
        )}
      </main>
    </section>
  );
};

export default MyTeatime;
