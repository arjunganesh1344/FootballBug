import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type Section = 'film' | 'data'

export interface ArticleMeta {
  slug: string
  section: Section
  title: string
  date: string
  description: string
  tags: string[]
}

const contentDir = path.join(process.cwd(), 'content')

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function getArticleSlugs(section: Section): string[] {
  const dir = path.join(contentDir, section)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

export function getArticleBySlug(
  section: Section,
  slug: string
): { meta: ArticleMeta; content: string } {
  const filePath = path.join(contentDir, section, `${slug}.mdx`)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return {
    meta: {
      slug,
      section,
      title: data.title ?? 'Untitled',
      date: data.date ?? '',
      description: data.description ?? '',
      tags: data.tags ?? [],
    },
    content,
  }
}

export function getAllArticles(section: Section): ArticleMeta[] {
  return getArticleSlugs(section)
    .map((slug) => getArticleBySlug(section, slug).meta)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
