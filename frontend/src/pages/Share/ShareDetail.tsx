import { useEffect, useState } from 'react';
import { fetchShareDetail } from '../../api/fetchShare';
import { useParams } from 'react-router-dom';
import { ShareDetailItem } from '../../types/ShareType';
import ArticleCard from '../../components/Article/ArticleCard';
import { ShareDetailResponse } from '../../constants/shareResponseTest';

const ShareDetail = () => {
  const [shareDetail, setsShareDetail] = useState<ShareDetailItem>(
    ShareDetailResponse.data
  );
  const { shareId } = useParams();
  useEffect(() => {
    // 임의 라우팅 -> shareId가 undefined인 경우 guard 추가
    fetchShareDetail(shareId)
      .then((res) => setsShareDetail(res.data.data))
      .catch((err) => console.log(err));
  }, [shareId]);
  return (
    <div className="grid grid-cols-12 h-screen">
      <aside className="hidden lg:flex col-span-2 bg-gray-300">leftAside</aside>
      <main className="col-span-12 lg:col-span-8 grid grid-cols-12">
        <aside className="col-span-4 p-2">
          <ArticleCard {...shareDetail} />
        </aside>
        <main className="col-span-8 bg-success p-2">innerArticle</main>
      </main>
      <aside className="hidden lg:flex col-span-2 bg-gray-300">
        reightAside
      </aside>
    </div>
  );
};

export default ShareDetail;
