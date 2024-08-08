import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const InputError = ({ error }: { error: string }) => (
  <div role="alert" className="alert bg-warning shadow text-white flex">
    <ExclamationTriangleIcon className="size-8" />
    <span className="font-bold">{error}</span>
  </div>
);

export default InputError;
