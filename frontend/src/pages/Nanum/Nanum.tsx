import NanumCard from '../../components/Card/NanumCard';
import TitleCard from '../../components/Title/TitleCard';

const Nanum = () => {
  return (
    <div className="flex justify-center">
      <aside></aside>
      <main id="nanum-body" className="w-3/5">
        <div id="nanum-inner-body">
          <TitleCard title="나눔" />
        </div>
        <section>
          <NanumCard />
        </section>
      </main>
      <aside></aside>
    </div>
  );
};

export default Nanum;
