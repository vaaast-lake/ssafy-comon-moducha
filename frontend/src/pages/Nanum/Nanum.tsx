import NanumCard from './components/NanumCard';
import TitleCard from '../../components/Title/TitleCard';
import Pagination from '../../components/Pagination/Pagination';

const NanumCardList = () => {
  const NanumCardArray = [];
  for (let i = 0; i < 6; i++) {
    NanumCardArray.push(<NanumCard key={`nanum_${i}`} />);
  }
  return NanumCardArray;
};

const Nanum = () => {
  return (
    <div className="flex h-full justify-center bg-[#FEFAE0]">
      <aside></aside>
      <main id="nanum-body" className="w-3/5">
        <header>
          <TitleCard title="나눔" />
        </header>
        <section id="nanum-list" className="grid gap-4 xl:grid-cols-2 p-5">
          <NanumCardList />
        </section>
        <footer className='flex justify-center'>
          <Pagination />
        </footer>
      </main>
      <aside></aside>
    </div>
  );
};

export default Nanum;
