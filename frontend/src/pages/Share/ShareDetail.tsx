import { useEffect, useState } from 'react';
import { fetchShareDetail } from '../../api/fetchShare';
import { useParams } from 'react-router-dom';
import { ShareDetailItem } from '../../types/ShareType';
import { ShareDetailResponse } from '../../constants/shareResponseTest';
import ArticleCard from '../../components/Article/ArticleCard';
import ArticleContent from '../../components/Article/ArticleContent';
import CommentList from '../../components/Comment/CommentList';

const ShareDetail = () => {
  const { boardId } = useParams();
  const [shareDetail, setsShareDetail] = useState<ShareDetailItem>(
    ShareDetailResponse.data
  );

  useEffect(() => {
    if (boardId) {
      fetchShareDetail(boardId)
        .then((res) => setsShareDetail(res.data.data))
        .catch((err) => console.log(err));
    }
  }, [boardId]);
  // router 파라미터가 누락된 경우
  if (!boardId) return null;
  return (
    <div className="grid grid-cols-12">
      <aside className="hidden lg:flex col-span-2"></aside>
      <main className="col-span-12 lg:col-span-8 md:grid md:grid-cols-12">
        <section className="md:col-span-4 p-2">
          <ArticleCard {...shareDetail} />
        </section>
        <article className="md:col-span-8 p-2">
          <ArticleContent {...shareDetail}>
            <CommentList boardType="shares" boardId={parseInt(boardId)} />
          </ArticleContent>
        </article>
      </main>
      <aside className="hidden lg:flex col-span-2"></aside>
    </div>
  );
};

export default ShareDetail;
