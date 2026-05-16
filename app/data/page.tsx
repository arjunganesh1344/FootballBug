import { getAllArticles } from '@/lib/articles'
import ArticleCard from '@/components/ArticleCard'

export default function DataPage() {
  const articles = getAllArticles('data')

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-cyan-400 mb-2">The Data</h1>
        <p className="text-neutral-400">Numbers that tell the story the eye test misses.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {articles.length === 0 ? (
          <p className="text-neutral-500">No articles yet.</p>
        ) : (
          articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))
        )}
      </div>
    </div>
  )
}
