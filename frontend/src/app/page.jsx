import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"

const featuredEvents = [
  {
    month: 'OCT',
    day: '12',
    location: 'San Francisco, CA',
    title: 'Tech Innovation Summit 2024',
    attendees: '+42',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDLUzCyiGBG4KISUSyUm0hBNoSwSCPgNbVe9C5z8F9xwwZxO1rJ5u7m82LjHh0XLUZQ_WY5Rmjm3qDe-t43Xhwfe_Sd6XveeZI__wvBS0g4BVcB51IYyrjJlVvm5MDJ2FpROqMC1-TMMlfuvc6Knr5mFf_POn20GLU8vfC6rC0OtLDB4sK4xqoelcL-DxKQqHj_M4IoAX2WviKEZI_awUDXiTB6s6XJc55Gp2H83FtZoSZxczb8xVN4sUJWqbWaqYZlNZJBo-VzcwE',
  },
  {
    month: 'NOV',
    day: '05',
    location: 'Austin, TX',
    title: 'Summer Garden Gala & Charity Auction',
    attendees: '+18',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAsWOPiNxfduPzY4Zwyvl8pXVuedJK7qvvTxMx6gm7blJToKm4et-bCsihUlwVvvn7yckl6vGmHvJD5fF10j_v4yo4kZkzz2KYU8Zpy0Rp8eIBjQEdrIkNt0qgwY7Tw3R93zoJPxU-ZBOzI5aayx-RN9M76xhS33BSoPUkyQFP89m-2ExKUY5tJIFI3mdUXJnmC7QSmOjkT_hoFNTDwsyZIHIrdN7fr9a-2hYMiqZ6xZOjCXMrUD7LMFK9XtmvNoZpSmFQ_DtC9bXc',
  },
  {
    month: 'DEC',
    day: '18',
    location: 'New York, NY',
    title: 'Creative Leaders Masterclass',
    attendees: '+8',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD__RkLP2ewZ-DXxY_LzR2bVtF4ErabsdauLa6LJ5papmgyZA58ofsBH6pX_ln03Ck4v8YqaPSxYbZmsiidpTAlQMXWvQToHz7eFZKCprCgBBxhLEfqoVFhSx2hAJNo43QAe7z-XfXdTbB3kGkgScuf9sgUKO07rn6uxSobfoYGcSG8b_USZIKPFp8qXsNetuvt8ymsiqni3CXjPRNlTnDWqwDQiVtneDBPNgjKu_riwiLF_IRqKcnzaD2LmzobOSEIfa2M7O-v_e8',
  },
]

const popularTopics = ['Tech', 'Music', 'Networking']

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f8fc] text-slate-900">
      <Navbar/>

      <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="absolute left-[-6rem] top-[-4rem] h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl" />
        <div className="absolute bottom-[-7rem] right-[-4rem] h-96 w-96 rounded-full bg-cyan-300/25 blur-3xl" />

        <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
          <span className="mb-5 inline-flex items-center rounded-full border border-indigo-200 bg-white px-4 py-1 text-sm font-medium text-indigo-700 shadow-sm">
            Event discovery and RSVP management in one place
          </span>

          <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Unforgettable events, perfectly organized.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            Discover incredible gatherings or host your own. GatherPulse streamlines RSVP management, guest analytics, and flawless execution from invite to after-party.
          </p>

          <div className="mt-10 w-full max-w-4xl rounded-3xl border border-white/70 bg-white/80 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-5">
            <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_auto]">
              <label className="relative block">
                <span className="sr-only">Search events</span>
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-11 pr-4 text-base text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                />
              </label>

              <label className="relative block">
                <span className="sr-only">Location</span>
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">⌖</span>
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-11 pr-4 text-base text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                />
              </label>

              <button className="rounded-2xl bg-slate-900 px-7 py-4 text-base font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-indigo-600 active:translate-y-0">
                Find Events
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Popular:</span>
              {popularTopics.map((topic) => (
                <button
                  key={topic}
                  className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-medium text-slate-600">
            <span className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">2,400+ events hosted</span>
            <span className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">98% RSVP accuracy</span>
            <span className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">Live guest insights</span>
          </div>
        </div>
      </section>

      <section id="featured-events" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Featured Events</h2>
              <p className="mt-2 text-base text-slate-600">Discover what&apos;s happening around you.</p>
            </div>

            <a className="hidden items-center gap-2 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700 md:inline-flex" href="#">
              View all <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {featuredEvents.map((event) => (
              <article
                key={event.title}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute right-4 top-4 rounded-2xl bg-white/90 px-3 py-2 text-center shadow-sm backdrop-blur">
                    <div className="text-xs font-bold tracking-[0.2em] text-slate-500">{event.month}</div>
                    <div className="text-2xl font-bold leading-none text-indigo-600">{event.day}</div>
                  </div>
                </div>

                <div className="flex h-full flex-col p-6">
                  <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
                    <span aria-hidden="true">⌖</span>
                    <span>{event.location}</span>
                  </div>

                  <h3 className="text-xl font-semibold tracking-tight text-slate-950">{event.title}</h3>

                  <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
                    <div className="flex -space-x-2">
                      <div className="h-8 w-8 rounded-full border-2 border-white bg-indigo-200" />
                      <div className="h-8 w-8 rounded-full border-2 border-white bg-cyan-200" />
                      <div className="flex h-8 w-12 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-xs font-semibold text-white">
                        {event.attendees}
                      </div>
                    </div>

                    <button className="text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700">
                      View Details
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <a className="inline-flex rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-300 hover:text-indigo-600" href="#">
              View all events
            </a>
          </div>
        </div>
      </section>

      <section id="host-section" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 overflow-hidden rounded-[2rem] bg-slate-950 px-8 py-10 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] lg:grid-cols-[1.2fr_0.8fr] lg:px-12 lg:py-14">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Host with confidence</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Build the event experience your guests will remember.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              From first invite to final follow-up, GatherPulse keeps every RSVP, reminder, and guest list detail in sync so you can focus on the experience.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[
              ['Smart invites', 'Automated reminders and instant guest updates.'],
              ['Guest analytics', 'Track responses, check-ins, and engagement trends.'],
              ['Smooth execution', 'Organize every moving part without manual spreadsheets.'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="text-base font-semibold text-white">{title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer/>
      {/* <footer className="border-t border-slate-200 bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_1fr] lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="text-2xl font-semibold tracking-tight text-slate-950">GatherPulse</div>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
              Elevating the event experience from the first invite to the final memory.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Platform</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
              <a href="#" className="transition-colors hover:text-indigo-600">About Us</a>
              <a href="#" className="transition-colors hover:text-indigo-600">Event Guidelines</a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Legal</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
              <a href="#" className="transition-colors hover:text-indigo-600">Terms of Service</a>
              <a href="#" className="transition-colors hover:text-indigo-600">Privacy Policy</a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Support</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
              <a href="#" className="transition-colors hover:text-indigo-600">Contact Support</a>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl border-t border-slate-200 pt-6 text-center text-xs font-medium uppercase tracking-[0.18em] text-slate-400 md:text-left">
          © 2024 GatherPulse. All rights reserved.
        </div>
      </footer> */}
    </main>
  )
}