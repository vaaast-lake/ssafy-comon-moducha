const TitleCard = ({ title }: { title: string }) => {
  return (
    <div className="card min-w-72 p-4 shadow-xl">
      <h1 className="text-2xl font-semibold">{title}</h1>
    </div>
  );
};

export default TitleCard;
