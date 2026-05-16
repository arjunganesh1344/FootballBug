import Link from 'next/link'
import type { ArticleMeta } from '@/lib/articles'
import { formatDate } from '@/lib/articles'

export default function ArticleCard({ article }: { article: ArticleMeta }) {
  const accentClass =
    article.section === 'film' ? 'text-orange-500' : 'text-cyan-400'

  return (
    <Link href={`/${article.section}/${article.slug}`} className="block group">
      <div className="border border-neutral-800 rounded-lg p-4 bg-neutral-900/50 hover:border-neutral-600 transition-colors">
        <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${accentClass}`}>
          {formatDate(article.date)}
        </p>
        <h3 className="font-semibold text-white group-hover:text-neutral-200 mb-1 leading-snug">
          {article.title}
        </h3>
        <p className="text-sm text-neutral-400 line-clamp-2">{article.description}</p>
        {article.tags.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
