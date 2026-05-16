import Link from 'next/link'
import { getAllArticles } from '@/lib/articles'
import ArticleCard from '@/components/ArticleCard'

export default function HomePage() {
  const filmArticles = getAllArticles('film').slice(0, 3)
  const dataArticles = getAllArticles('data').slice(0, 3)

  return (
    <div className="space-y-16">
      <section className="pt-8">
        <h1 className="text-5xl font-bold tracking-tight text-white mb-3">FootballBug</h1>
        <p className="text-neutral-400 text-lg">NFL film breakdown and data analytics.</p>
      </section>

      <div className="grid md:grid-cols-2 gap-10">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-orange-500">The Film</h2>
            <Link
              href="/film"
              className="text-sm text-neutral-400 hover:text-orange-500 transition-colors"
            >
              All articles →
            </Link>
          </div>
          <div className="space-y-4">
            {filmArticles.length === 0 ? (
              <p className="text-neutral-600 text-sm">No articles yet.</p>
            ) : (
              filmArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-cyan-400">The Data</h2>
            <Link
              href="/data"
              className="text-sm text-neutral-400 hover:text-cyan-400 transition-colors"
            >
              All articles →
            </Link>
          </div>
          <div className="space-y-4">
            {dataArticles.length === 0 ? (
              <p className="text-neutral-600 text-sm">No articles yet.</p>
            ) : (
              dataArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
