"use client"
import Link from 'next/link'

import React from 'react'
import useAppContext from '@/context/AppContext'

const Navbar = () => {
  const { userLoggedIn, email, role, logout } = useAppContext()

  return (
    <div>      <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-indigo-600">
            GatherPulse
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600" href="/browse">
              Discover Events
            </Link>
            <Link className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600" href="/hostevent">
              Host an Event
            </Link>
          </div>

          {userLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-900">{email}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{role || 'Member'}</p>
              </div>
              <button
                onClick={logout}
                className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-indigo-600 active:translate-y-0"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link href="/login" className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-indigo-600 active:translate-y-0">
              Log In
            </Link>
          )}
        </div>
      </nav></div>
  )
}

export default Navbar