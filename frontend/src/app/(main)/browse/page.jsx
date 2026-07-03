"use client"

import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import Link from 'next/link'

const categories = ['Tech Talks', 'Music Festivals', 'Networking', 'Art & Culture', 'Food & Drink']
const dates = ['Any time', 'Today', 'Weekend', 'Next week']
const priceRanges = ['Free', 'Paid']

const formatUtcDate = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = monthNames[date.getUTCMonth()]
  return `${day} ${month}`
}

const formatUtcTime = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  return `${hours}:${minutes} UTC`
}

const formatUtcDateTime = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes} UTC`
}

// No demo data shown — real events fetched from API

function FilterSection({ title, items, selected = new Set(), onToggle }) {
  return (
    <section className="space-y-3 border-b border-slate-200 pb-5 last:border-b-0 last:pb-0">
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{title}</div>
      <div className="space-y-2">
        {items.map((item) => (
          <label key={item} className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={selected.has(item)}
              onChange={() => onToggle && onToggle(item)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-200"
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </section>
  )
}

function EventCard({ event }) {
  const image = (event.images && event.images.length && event.images[0]) || event.image || 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=900&q=80'
  const hasDate = !!event.date
  const dateLabel = hasDate ? formatUtcDate(event.date) : event.dateLabel
  const month = hasDate ? formatUtcTime(event.date) : event.month

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 rounded-2xl bg-white/95 px-3 py-2 text-center shadow-sm backdrop-blur">
          <div className="text-[10px] font-bold tracking-[0.24em] text-slate-500">{dateLabel}</div>
          <div className="text-2xl font-bold leading-none text-indigo-600">{month}</div>
        </div>
        <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-500 shadow-sm backdrop-blur transition-colors hover:text-indigo-600">
          ♥
        </button>
      </div>

      <div className="space-y-4 p-4">
        <div className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-700">
          {event.category || (event.mode || '').toUpperCase()}
        </div>

        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-950">{event.title}</h3>
          <p className="mt-2 text-sm text-slate-500">{event.location}</p>
          <p className="mt-1 text-sm text-slate-500">{event.time || (event.date ? formatUtcDateTime(event.date) : '')}</p>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">•</span>
            <span>View details</span>
          </div>
          <Link href={`/eventdetails/${event._id || event.id}`} className="text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700">
            Open
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function Browse() {
  const [eventsData, setEventsData] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState('')
  const [locationTerm, setLocationTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState(new Set())
  const [selectedDateFilter, setSelectedDateFilter] = useState('Any time')

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || ''
    const url = apiBase ? `${apiBase}/event/getall` : '/api/event/getall'

    axios
      .get(url)
      .then((res) => {
        const data = res.data
        setEventsData(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        console.error('Failed to load events', err)
        setEventsData([])
      })
      .finally(() => setLoading(false))
  }, [])

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  const applyFilters = useMemo(() => {
    return () => {
      const now = new Date()
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const endOfNextWeek = new Date()
      endOfNextWeek.setDate(startOfToday.getDate() + 7)

      const filtered = eventsData.filter((ev) => {
        // search
        const search = searchTerm.trim().toLowerCase()
        if (search) {
          const hay = `${ev.title || ''} ${ev.description || ''} ${ev.location || ''}`.toLowerCase()
          if (!hay.includes(search)) return false
        }

        // location
        const loc = locationTerm.trim().toLowerCase()
        if (loc) {
          if (!((ev.location || '').toLowerCase().includes(loc))) return false
        }

        // category
        if (selectedCategories.size > 0) {
          const cat = (ev.category || ev.mode || '').toString()
          if (![...selectedCategories].some((c) => c.toLowerCase() === (cat || '').toLowerCase())) return false
        }

        // date filters
        if (selectedDateFilter && selectedDateFilter !== 'Any time' && ev.date) {
          const d = new Date(ev.date)
          if (selectedDateFilter === 'Today') {
            if (d < startOfToday || d >= new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000)) return false
          } else if (selectedDateFilter === 'Weekend') {
            const day = d.getDay()
            if (day !== 6 && day !== 0) return false
          } else if (selectedDateFilter === 'Next week') {
            if (d < startOfToday || d > endOfNextWeek) return false
          }
        }

        return true
      })

      setFilteredEvents(filtered)
    }
  }, [eventsData, searchTerm, locationTerm, selectedCategories, selectedDateFilter])

  useEffect(() => {
    // apply filters whenever inputs change
    if (!loading) applyFilters()
  }, [loading, applyFilters])

  return (
    <main className="min-h-screen bg-[#f4f6fb] text-slate-900">

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Discover Your Next Experience</h1>

          <div className="mx-auto mt-6 flex w-full max-w-3xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_16px_40px_rgba(15,23,42,0.06)] md:flex-row md:items-center">
            <label className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by keyword..."
                className="h-12 w-full rounded-xl border border-transparent bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-200 focus:bg-white"
              />
            </label>
            <label className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">⌖</span>
              <input
                type="text"
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
                placeholder="Location..."
                className="h-12 w-full rounded-xl border border-transparent bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-200 focus:bg-white"
              />
            </label>
            <button
              onClick={() => applyFilters()}
              className="h-12 rounded-xl bg-indigo-600 px-7 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 md:w-32"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-8 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] lg:sticky lg:top-20 lg:h-fit">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-lg font-semibold text-slate-950">Filters</h2>
            <button
              onClick={() => {
                setSelectedCategories(new Set())
                setSelectedDateFilter('Any time')
                setSearchTerm('')
                setLocationTerm('')
              }}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Reset
            </button>
          </div>

            <div className="mt-5 space-y-5">
            <FilterSection title="Category" items={categories} selected={selectedCategories} onToggle={toggleCategory} />

            <section className="space-y-3 border-b border-slate-200 pb-5">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Date</div>
              <div className="flex flex-wrap gap-2">
                {dates.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedDateFilter(item)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${selectedDateFilter === item ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {item}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-3 border-b border-slate-200 pb-5">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Price Range</div>
              <div className="space-y-2">
                {priceRanges.map((item) => (
                  <label key={item} className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                    <input type="radio" name="price" className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-200" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Distance</div>
              <input type="range" min="0" max="100" defaultValue="40" className="w-full accent-indigo-600" />
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>1 km</span>
                <span>100 km</span>
              </div>
            </section>
          </div>
        </aside>

        <div className="space-y-5">
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)] lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm text-slate-600">Showing <span className="font-semibold text-slate-950">{loading ? '…' : filteredEvents.length}</span> events</p>

            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span>Sort by:</span>
                <button className="inline-flex items-center gap-1 font-semibold text-slate-950">Featured <span className="text-slate-400">⌄</span></button>
              </div>

              <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
                <button className="rounded-lg bg-white px-3 py-2 text-indigo-600 shadow-sm">◫</button>
                <button className="rounded-lg px-3 py-2 text-slate-400">☷</button>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {loading ? (
              <div>Loading events…</div>
            ) : (
              filteredEvents.map((event) => <EventCard key={event._id || event.title} event={event} />)
            )}
          </div>

          <div className="flex items-center justify-center gap-2 pt-3">
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm">‹</button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm">1</button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm">2</button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm">3</button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm">›</button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="text-xl font-semibold tracking-tight text-indigo-600">GatherPulse</div>
            <p className="mt-3 text-sm leading-6 text-slate-600">Connecting people through extraordinary event experiences. Discover, host, and grow your community.</p>
            <p className="mt-8 text-xs text-slate-500">© 2024 GatherPulse. All rights reserved.</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Explore</h3>
              <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
                <a href="#" className="hover:text-indigo-600">Discover Events</a>
                <a href="#" className="hover:text-indigo-600">Host an Event</a>
                <a href="#" className="hover:text-indigo-600">Event Guidelines</a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Company</h3>
              <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
                <a href="#" className="hover:text-indigo-600">About Us</a>
                <a href="#" className="hover:text-indigo-600">Contact Support</a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Legal</h3>
              <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
                <a href="#" className="hover:text-indigo-600">Terms of Service</a>
                <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
