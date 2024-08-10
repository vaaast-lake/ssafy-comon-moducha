import SideLayout from '../Layout/SideLayout';
const ArticleLoading = () => {
  return (
    <div className="grid grid-cols-10">
      <SideLayout></SideLayout>
      <main className="col-span-10 lg:col-span-6 md:grid md:grid-cols-12">
        <section className="md:col-span-4 p-2">
          <div className="md:sticky md:top-2 flex flex-col overflow-clip p-4 border shadow gap-4">
            {/* card skeleton */}
            <div className="flex w-full flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                <div className="flex flex-col w-full gap-4">
                  <div className="skeleton h-4 w-1/4"></div>
                  <div className="skeleton h-4 w-3/4"></div>
                </div>
              </div>
              <div className="skeleton h-32 w-full"></div>
            </div>
          </div>
        </section>
        <article className="md:col-span-8 p-2">
          <div className="p-4 shadow border flex flex-col gap-4">
            {/* content skeleton */}
            <div className="flex w-full flex-col gap-4">
              <div className="skeleton h-60 w-full"></div>
              <div className="skeleton h-4 w-1/12"></div>
              <div className="skeleton h-4 w-1/6"></div>
              <div className="skeleton h-4 w-1/6"></div>
              <div className="skeleton h-4 w-4/6"></div>
              <div className="skeleton h-4 w-4/6"></div>
              <div className="skeleton h-4 w-4/6"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
            </div>
          </div>
        </article>
      </main>
      <SideLayout></SideLayout>
    </div>
  );
};

export default ArticleLoading;
