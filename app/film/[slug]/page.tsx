import { getArticleBySlug, getArticleSlugs, formatDate } from '@/lib/articles'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return getArticleSlugs('film').map((slug) => ({ slug }))
}

export default async function FilmArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let article
  try {
    article = getArticleBySlug('film', slug)
  } catch {
    notFound()
  }

  const { meta, content } = article

  return (
    <article className="max-w-2xl mx-auto">
      <div className="mb-10">
        <p className="text-orange-500 text-sm font-semibold uppercase tracking-wider mb-3">
          The Film
        </p>
        <h1 className="text-4xl font-bold text-white mb-3 leading-tight">{meta.title}</h1>
        <p className="text-neutral-400 mb-4 text-lg">{meta.description}</p>
        <div className="flex items-center gap-3 text-sm text-neutral-500 flex-wrap">
          <span>{formatDate(meta.date)}</span>
          {meta.tags.map((tag) => (
            <span key={tag} className="bg-neutral-800 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="prose prose-invert prose-neutral max-w-none prose-headings:text-white prose-a:text-orange-500 prose-strong:text-white prose-code:text-orange-300">
        <MDXRemote source={content} />
      </div>
    </article>
  )
}
