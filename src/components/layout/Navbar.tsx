'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/utils/cn'
import Logo from '../Logo'
import { motion, useAnimation } from 'framer-motion'
import { Sun, Moon } from 'react-feather'

const navigation = [
  { name: 'Ana Sayfa', href: '/' },
  { name: 'İstatistikler', href: '/statistics' },
  { name: 'Profil', href: '/profile' }
]

function getCookie(name: string) {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [dark, setDark] = useState(false)
  const controls = useAnimation()

  useEffect(() => {
    const token = getCookie('token')
    if (token) {
      fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.name) {
            setUser({ name: data.name, email: data.email })
          } else {
            setUser(null)
          }
        })
        .catch(() => setUser(null))
    } else {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/'
    setUser(null)
    router.push('/auth/login')
  }

  return (
    <motion.nav
      className={cn(
        'fixed top-0 left-0 w-full z-40 transition-all duration-300',
        scrolled
          ? 'bg-white/90 dark:bg-fitness-dark/90 shadow-lg backdrop-blur-md'
          : 'bg-transparent dark:bg-transparent shadow-none'
      )}
      animate={scrolled ? { y: 0, boxShadow: '0 2px 16px 0 rgba(30,144,255,0.08)' } : { y: 0, boxShadow: '0 0px 0px 0 transparent' }}
      initial={false}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Logo />
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-md',
                    pathname === item.href
                      ? 'bg-gray-100 text-gray-900 dark:bg-fitness-dark dark:text-fitness-green'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-fitness-dark dark:hover:text-fitness-green'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              aria-label="Toggle Dark Mode"
              onClick={() => setDark((d) => !d)}
              className="p-2 rounded-full bg-gray-100 dark:bg-fitness-dark hover:bg-fitness-blue/10 dark:hover:bg-fitness-green/10 transition-colors"
            >
              {dark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-fitness-blue" />}
            </button>
            <div className="hidden md:flex items-center md:ml-6">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 px-4 py-2"
                  >
                    {user.name ? `Merhaba, ${user.name}` : 'Profilim'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="ml-4 text-sm font-medium text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 px-4 py-2"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/auth/register"
                    className="ml-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
} 