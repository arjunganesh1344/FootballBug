import { getAllArticles } from '@/lib/articles'
import ArticleCard from '@/components/ArticleCard'

export default function FilmPage() {
  const articles = getAllArticles('film')

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-orange-500 mb-2">The Film</h1>
        <p className="text-neutral-400">Breaking down what happens between the whistles.</p>
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
