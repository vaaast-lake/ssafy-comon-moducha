const ShareCard = () => {
  return (
    <>
      <div className="card card-side bg-base-100 shadow-xl w-full min-w-80">
        <figure className="size-40 shrink-0">
          <img
            src="https://the-chinese-tea-company.com/cdn/shop/files/Loose_Leaf_Tea_1600x.jpg?v=1613558529"
            alt="Album"
          />
        </figure>
        <div className="card-body p-0">
          <div className="p-4">
            <h2 className="card-title">보이차 나눔합니다.</h2>
            <p></p>
            <div className="flex shrink-0">
              <div className="badge badge-info shadow-xl">티타임</div>
              <div className="badge badge-warning">
                어쩌구
              </div>
              <div className="badge badge-error">저쩌구</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareCard;
