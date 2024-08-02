const Home = () => {
  return (
    <div className="grid grid-cols-12 h-screen">
      {/* 좌측 사이드바 영역 */}
      <aside className="hidden lg:flex col-span-2"></aside>
      <main className="col-span-12 m-5 lg:col-span-8 flex flex-col gap-4 bg-gray-200"></main>
      {/* 우측 사이드바 영역 */}
      <aside className="hidden lg:flex col-span-2"></aside>
    </div>
  );
};

export default Home;
