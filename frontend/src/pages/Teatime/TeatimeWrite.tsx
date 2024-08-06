import ArticleWrite from '../../components/Article/ArticleWrite';
import TitleCard from '../../components/Title/TitleCard';

const TeatimeWrite = () => {
  return (
    <>
      <div className="grid grid-cols-12">
        <aside className="hidden lg:flex col-span-3"></aside>
        <main className="col-span-12 lg:col-span-6 flex flex-col h-screen m-5 gap-4">
          <TitleCard>
            <span className="text-disabled">티타임 글쓰기</span>
          </TitleCard>
          <hr />
          <ArticleWrite boardType="shares" />
        </main>
        <aside className="hidden lg:flex col-span-3"></aside>
      </div>
    </>
  );
};

export default TeatimeWrite;
