import React from 'react'

const Footer = () => {
  return (
    <div>
              <footer className="border-t border-slate-200 bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
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
      </footer>
    </div>
  )
}

export default Footer