import { useParams } from 'react-router-dom';
import ArticleCard from '../../components/Article/ArticleCard';
import ArticleContent from '../../components/Article/ArticleContent';
import CommentList from '../../components/Comment/CommentList';
import SideLayout from '../../components/Layout/SideLayout';
import ArticleLoading from '../../components/Loading/ArticleLoading';
import useFetchDetail from '../../hooks/useFetchDetail';
import { TeatimeDetailItem } from '../../types/TeatimeType';

const TeatimeDetail = () => {
  const { boardId } = useParams();
  if (!boardId) return null;
  const { articleDetail: teatimeDetail, isLoading } =
    useFetchDetail<TeatimeDetailItem>('teatimes', boardId);
  if (isLoading) return <ArticleLoading />;
  if (!teatimeDetail) return null;
  return (
    <div className="grid grid-cols-10">
      <SideLayout></SideLayout>
      <main className="col-span-10 lg:col-span-6 md:grid md:grid-cols-12">
        <section className="md:col-span-4 p-2">
          <ArticleCard {...{ boardType: 'teatimes', ...teatimeDetail }} />
        </section>
        <article className="md:col-span-8 p-2">
          <ArticleContent {...{ boardType: 'teatimes', ...teatimeDetail }}>
            <CommentList boardType="teatimes" boardId={parseInt(boardId)} />
          </ArticleContent>
        </article>
      </main>
      <SideLayout></SideLayout>
    </div>
  );
};

export default TeatimeDetail;
