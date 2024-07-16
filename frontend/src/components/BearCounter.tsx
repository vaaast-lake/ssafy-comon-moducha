import useBearStore from '../stores/bearStore';

const BearCounter = () => {
  const bears = useBearStore((state) => state.bears);
  return <h1>{bears}</h1>;
};

export default BearCounter;
