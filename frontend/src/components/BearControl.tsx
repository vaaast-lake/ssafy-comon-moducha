import useBearStore from '../stores/bearStore';

const BearControl = () => {
  const increaseBear = useBearStore((state) => state.increaseBear);
  return (
    <button className="btn" onClick={increaseBear}>
      Plus Bear
    </button>
  );
};

export default BearControl;
