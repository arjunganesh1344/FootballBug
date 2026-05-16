import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-green-900/40 bg-neutral-950/90 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight text-white flex items-center gap-2">
          <span>🏈</span>
          FootballBug
        </Link>
        <nav className="flex gap-6 text-sm font-medium">
          <Link
            href="/film"
            className="text-orange-500 hover:text-orange-400 transition-colors"
          >
            The Film
          </Link>
          <Link
            href="/data"
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            The Data
          </Link>
        </nav>
      </div>
    </header>
  )
}
