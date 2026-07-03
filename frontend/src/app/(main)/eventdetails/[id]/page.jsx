"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import useAppContext from '../../../../context/AppContext'

export default function EventDetails() {
  const params = useParams()
  const id = params?.id

  const { userLoggedIn, userId } = useAppContext()

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [commentText, setCommentText] = useState('')

  useEffect(() => {
    if (!id || !userLoggedIn) {
      // don't fetch when we don't have an id or user is not logged in
      setLoading(false)
      return
    }

    setLoading(true)
    const apiBase = process.env.NEXT_PUBLIC_API_URL || ''
    const url = apiBase ? `${apiBase}/event/getbyid/${id}` : `/api/event/getbyid/${id}`

    axios
      .get(url)
      .then((res) => setEvent(res.data))
      .catch((err) => {
        console.error(err)
        setError('Failed to load event')
      })
      .finally(() => setLoading(false))
  }, [id, userLoggedIn])

  const handleRegister = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Please log in to register for this event')
      return
    }

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || ''
      const url = apiBase ? `${apiBase}/event/register/${id}` : `/api/event/register/${id}`
      const headers = { 'x-auth-token': token }
      const res = await axios.patch(url, {}, { headers })
      setEvent(res.data)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to register')
    }
  }

  const handleUnregister = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Please log in to unregister from this event')
      return
    }

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || ''
      const url = apiBase ? `${apiBase}/event/unregister/${id}` : `/api/event/unregister/${id}`
      const headers = { 'x-auth-token': token }
      const res = await axios.patch(url, {}, { headers })
      setEvent(res.data)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to unregister')
    }
  }

  const postComment = async () => {
    if (!commentText.trim()) return
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Please log in to post a comment')
      return
    }

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || ''
      const url = apiBase ? `${apiBase}/event/comment/${id}` : `/api/event/comment/${id}`
      const headers = { 'x-auth-token': token }
      const res = await axios.post(url, { text: commentText }, { headers })
      setEvent(res.data)
      setCommentText('')
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to post comment')
    }
  }

  // If user is not logged in show a clear prompt instead of event content
  if (!userLoggedIn) {
    return (
      <main className="min-h-screen bg-[#f4f6fb] p-6 flex items-center justify-center">
        <div className="max-w-lg bg-white rounded-2xl shadow p-8 text-center">
          <h2 className="text-2xl font-semibold mb-2">Login first</h2>
          <p className="text-sm text-slate-600 mb-4">You must be logged in to view this event.</p>
          <Link href="/login" className="inline-flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 text-white">Go to Login</Link>
        </div>
      </main>
    )
  }

  if (loading) return <div className="p-8">Loading event…</div>
  if (error) return <div className="p-8 text-red-600">{error}</div>
  if (!event) return <div className="p-8">No event found</div>

  const mainImage = (event.images && event.images[0]) || ''
  const userRsvp = (event.registeredUsers || []).find((entry) => String(entry.userId?._id || entry.userId) === userId)
  const userRsvpStatus = userRsvp?.status || 'Not Registered'
  const formatUtcDateTime = (value) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    const day = String(date.getUTCDate()).padStart(2, '0')
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const year = date.getUTCFullYear()
    const hours = String(date.getUTCHours()).padStart(2, '0')
    const minutes = String(date.getUTCMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes} UTC`
  }
  const dateStr = event.date ? formatUtcDateTime(event.date) : ''
  const goingCount = (event.registeredUsers || []).filter((r) => r.status === 'Going').length

  return (
    <main className="min-h-screen bg-[#f4f6fb] p-6">
      <div className="mx-auto max-w-6xl bg-white rounded-2xl shadow px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {mainImage && (
              <img src={mainImage} alt={event.title} className="w-full rounded-xl object-cover h-80" />
            )}

            <h1 className="mt-4 text-3xl font-semibold text-slate-900">{event.title}</h1>
            <p className="mt-2 text-sm text-slate-600">Hosted by {event.CreatedBy?.name || 'Organizer'}</p>

            <div className="mt-6 grid grid-cols-1 gap-4">
              <div className="prose max-w-none text-slate-700">
                <h2>About the Event</h2>
                <p>{event.description}</p>
              </div>

              {event.timeline && event.timeline.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Event Timeline</h3>
                  <ul className="mt-2 space-y-2">
                    {event.timeline.map((t, idx) => (
                      <li key={idx} className="rounded border p-3 bg-slate-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{t.title}</div>
                            <div className="text-sm text-slate-600">{t.description}</div>
                          </div>
                          <div className="text-sm text-slate-500">{formatUtcDateTime(t.timestamp)}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {event.faqs && event.faqs.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
                  <div className="mt-3 space-y-2">
                    {event.faqs.map((f, i) => (
                      <details key={i} className="border rounded p-3 bg-slate-50">
                        <summary className="font-medium">{f.question}</summary>
                        <p className="mt-2 text-sm text-slate-600">{f.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-lg font-semibold">Community Discussion</h3>
                <div className="mt-4 space-y-4">
                  {(event.CommentSchema || []).map((c, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <img src={c.avatar} alt={c.user} className="h-10 w-10 rounded-full object-cover" />
                      <div>
                        <div className="text-sm font-semibold">{c.user}</div>
                        <div className="text-xs text-slate-500">{formatUtcDateTime(c.date)}</div>
                        <div className="mt-1 text-sm text-slate-700">{c.text}</div>
                      </div>
                    </div>
                  ))}

                  <div className="mt-2">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment"
                      className="w-full rounded border p-2"
                      rows={3}
                    />
                    <div className="mt-2 text-right">
                      <button onClick={postComment} className="inline-flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 text-white">Post comment</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border p-4 bg-white shadow">
              <div className="text-sm text-slate-500">{event.mode} • {event.location}</div>
              <div className="mt-2 text-2xl font-bold">{dateStr}</div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-slate-600">{goingCount} going</div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="mb-3 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  Your RSVP: <span className="font-semibold text-slate-900">{userRsvpStatus}</span>
                </div>
                <button onClick={handleRegister} className="w-full rounded bg-indigo-600 px-4 py-2 text-white">{userRsvpStatus === 'Going' ? 'Registered' : 'Register'}</button>
                <button onClick={handleUnregister} className="w-full rounded border px-4 py-2">Unregister</button>
              </div>

              {event.contact && event.contact.length > 0 && (
                <div className="mt-4 text-sm text-slate-700">
                  <div className="font-semibold">Contact</div>
                  {event.contact.map((c, i) => (
                    <div key={i}>{c.name} {c.email && <span>• {c.email}</span>}</div>
                  ))}
                </div>
              )}
            </div>

            {event.googleMapLink && (
              <div className="rounded-2xl border overflow-hidden">
                <iframe
                  title="event-map"
                  src={event.googleMapLink}
                  className="w-full h-48 border-0"
                />
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  )
}