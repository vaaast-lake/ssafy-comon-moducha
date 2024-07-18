const NanumCard = () => {
  return (
    <>
      <div className="card card-side bg-base-100 shadow-xl w-3/5">
        <figure className="size-24">
          <img
            src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg"
            alt="Album"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">보이차 나눔합니다.</h2>
          <p>Click the button to listen on Spotiwhy app.</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Listen</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NanumCard;
