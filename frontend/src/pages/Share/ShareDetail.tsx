import { useEffect, useState } from 'react';
import { fetchShareDetail } from '../../api/fetchShare';
import { useParams } from 'react-router-dom';
import { ShareDetailItem } from '../../types/ShareType';
import ArticleCard from '../../components/Article/ArticleCard';
import { ShareDetailResponse } from '../../constants/shareResponseTest';
import ArticleContent from '../../components/Article/ArticleContent';

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
      <aside className="hidden lg:flex col-span-2"></aside>
      <div className="col-span-12 lg:col-span-8 sm:grid sm:grid-cols-12">
        <aside className="sm:col-span-4 p-2">
          <ArticleCard {...shareDetail} />
        </aside>
        <main className="sm:col-span-8 p-2">
          <ArticleContent {...shareDetail} />
        </main>
      </div>
      <aside className="hidden lg:flex col-span-2"></aside>
    </div>
  );
};

export default ShareDetail;
