import useBearStore from '../stores/bearStore';

const BearControl = () => {
  const increaseBear = useBearStore((state) => state.increaseBear);
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={increaseBear}
    >
      Plus Bear
    </button>
  );
};

export default BearControl;
