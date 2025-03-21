'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavLink({ href, children, pathMatch }) {
  const pathname = usePathname()
  const isActive = pathMatch ? pathMatch(pathname) : pathname === href

  return (
    <Link 
      href={href} 
      className={`relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group ${
        isActive ? 'text-gray-900 dark:text-white' : ''
      }`}
    >
      {children}
      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 dark:bg-white transform origin-left transition-transform duration-300 ${
        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
      }`} />
    </Link>
  )
}
