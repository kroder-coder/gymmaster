'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PlusCircle, Clock, Dumbbell, BookOpen } from 'lucide-react'

const links = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/log', icon: PlusCircle, label: 'Log' },
  { href: '/routines', icon: BookOpen, label: 'Routines' },
  { href: '/history', icon: Clock, label: 'History' },
  { href: '/exercises', icon: Dumbbell, label: 'Exercises' },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 flex justify-around items-center h-16 z-50">
      {links.map(({ href, icon: Icon, label }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
              active ? 'text-orange-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span className="text-xs">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
