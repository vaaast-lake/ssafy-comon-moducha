import { TbError404 } from 'react-icons/tb';

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center mt-20 gap-10">
      <TbError404 className="size-80 text-tea" />
      <h1 className="text-3xl font-semibold text-wood">
        요청하신 페이지를 찾지 못했습니다
      </h1>
    </div>
  );
};

export default ErrorPage;
