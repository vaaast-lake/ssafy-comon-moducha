import TitleCard from '../../components/Title/TitleCard';
import TextEditor from '../../utils/TextEditor/TextEditor';

const ShareWrite = () => {
  return (
    <>
      <div className="grid grid-cols-12">
        <aside className="hidden md:flex col-span-2"></aside>
        <main className="col-span-12 md:col-span-8 flex flex-col h-screen m-5 gap-4">
          <TitleCard>
            <span className="text-disabled">나눔 글쓰기</span>
          </TitleCard>
          <hr />
          <TextEditor />
        </main>
        <aside className="hidden md:flex col-span-2"></aside>
      </div>
    </>
  );
};

export default ShareWrite;
