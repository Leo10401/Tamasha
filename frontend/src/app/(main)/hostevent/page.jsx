"use client"

import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import useAppContext from "@/context/AppContext"

const initialForm = {
  title: "",
  description: "",
  mode: "Online",
  images: [],
  date: "",
  location: "",
  googleMapLink: "",
  contact: [
    {
      name: "",
      email: "",
      phone: "",
    },
  ],
  timeline: [
    {
      title: "",
      description: "",
      timestamp: "",
      status: "Pending",
    },
  ],
  faqs: [{ question: "", answer: "" }],
}

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

const getGoogleMapsPreviewUrl = (link) => {
  const trimmedLink = link.trim()

  if (!trimmedLink) {
    return ""
  }

  try {
    const parsedUrl = new URL(trimmedLink)
    const host = parsedUrl.hostname.toLowerCase()

    if (host.includes("maps.app.goo.gl") || host.includes("goo.gl")) {
      return ""
    }

    if (host.includes("google.com") && parsedUrl.pathname.includes("/maps")) {
      parsedUrl.searchParams.set("output", "embed")
      return parsedUrl.toString()
    }

    return `https://www.google.com/maps?output=embed&q=${encodeURIComponent(trimmedLink)}`
  } catch {
    return `https://www.google.com/maps?output=embed&q=${encodeURIComponent(trimmedLink)}`
  }
}

const formatUtcDateTime = (value) => {
  if (!value) {
    return ""
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ""
  }

  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const day = String(date.getUTCDate()).padStart(2, "0")
  const hours = String(date.getUTCHours()).padStart(2, "0")
  const minutes = String(date.getUTCMinutes()).padStart(2, "0")

  return `${year}-${month}-${day} ${hours}:${minutes} UTC`
}

export default function HostEvent() {
  const router = useRouter()
  const { userLoggedIn } = useAppContext()
  const [form, setForm] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const mapPreviewUrl = getGoogleMapsPreviewUrl(form.googleMapLink)

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const uploadImageToCloudinary = async (file) => {
    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary upload settings are missing")
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", uploadPreset)

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Image upload failed")
    }

    const result = await response.json()
    return result.secure_url
  }

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || [])

    if (!files.length) {
      return
    }

    setIsUploadingImage(true)

    try {
      const uploadedUrls = []

      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          toast.error(`Skipped non-image file: ${file.name}`)
          continue
        }

        const url = await uploadImageToCloudinary(file)
        uploadedUrls.push(url)
      }

      if (uploadedUrls.length > 0) {
        setForm((current) => ({
          ...current,
          images: [...current.images, ...uploadedUrls],
        }))
        toast.success("Image uploaded to Cloudinary")
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.message || "Unable to upload image")
    } finally {
      setIsUploadingImage(false)
      event.target.value = ""
    }
  }

  const removeImage = (index) => {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, imageIndex) => imageIndex !== index),
    }))
  }

  const updateContact = (index, field, value) => {
    setForm((current) => ({
      ...current,
      contact: current.contact.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    }))
  }

  const addContact = () => {
    setForm((current) => ({
      ...current,
      contact: [...current.contact, { name: "", email: "", phone: "" }],
    }))
  }

  const removeContact = (index) => {
    setForm((current) => ({
      ...current,
      contact: current.contact.length === 1 ? current.contact : current.contact.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const updateTimeline = (index, field, value) => {
    setForm((current) => ({
      ...current,
      timeline: current.timeline.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    }))
  }

  const addTimelineItem = () => {
    setForm((current) => ({
      ...current,
      timeline: [...current.timeline, { title: "", description: "", timestamp: "", status: "Pending" }],
    }))
  }

  const removeTimelineItem = (index) => {
    setForm((current) => ({
      ...current,
      timeline: current.timeline.length === 1 ? current.timeline : current.timeline.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const setThumbnailImage = (index) => {
    setForm((current) => {
      if (index === 0 || index < 0 || index >= current.images.length) {
        return current
      }

      const nextImages = [...current.images]
      const [selectedImage] = nextImages.splice(index, 1)
      nextImages.unshift(selectedImage)

      return {
        ...current,
        images: nextImages,
      }
    })
  }

  const updateFaq = (index, field, value) => {
    setForm((current) => ({
      ...current,
      faqs: current.faqs.map((faq, faqIndex) => (faqIndex === index ? { ...faq, [field]: value } : faq)),
    }))
  }

  const addFaq = () => {
    setForm((current) => ({
      ...current,
      faqs: [...current.faqs, { question: "", answer: "" }],
    }))
  }

  const removeFaq = (index) => {
    setForm((current) => ({
      ...current,
      faqs: current.faqs.length === 1 ? current.faqs : current.faqs.filter((_, faqIndex) => faqIndex !== index),
    }))
  }

  const resetForm = () => {
    setForm(initialForm)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const token = localStorage.getItem("token")

    if (!token) {
      toast.error("Please log in before hosting an event")
      router.push("/login")
      return
    }

    if (!form.title.trim() || !form.description.trim() || !form.location.trim() || !form.date || form.images.length === 0) {
      toast.error("Title, description, location, date, and at least one image are required")
      return
    }

    const timeline = form.timeline
      .map((item) => ({
        title: item.title.trim(),
        description: item.description.trim(),
        timestamp: item.timestamp ? new Date(item.timestamp).toISOString() : "",
        status: item.status,
      }))
      .filter((item) => item.title && item.description && item.timestamp)

    const contact = form.contact
      .map((item) => ({
        name: item.name.trim(),
        email: item.email.trim(),
        phone: item.phone.trim(),
      }))
      .filter((item) => item.name || item.email || item.phone)

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      mode: form.mode,
      images: form.images,
      date: new Date(form.date).toISOString(),
      location: form.location.trim(),
      googleMapLink: form.googleMapLink.trim(),
      contact,
      timeline,
      faqs: form.faqs
        .map((faq) => ({
          question: faq.question.trim(),
          answer: faq.answer.trim(),
        }))
        .filter((faq) => faq.question && faq.answer),
    }

    setIsSubmitting(true)

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/event/add`, payload, {
        headers: {
          "x-auth-token": token,
        },
      })

      toast.success("Event created successfully")
      resetForm()
      router.push("/browse")
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message || "Failed to create event")
    } finally {
      setIsSubmitting(false)
    }
  }

  // If user is not logged in, show a friendly prompt instead of the form
  if (!userLoggedIn) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.14),_transparent_34%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] text-slate-900 flex items-center justify-center">
        <div className="max-w-lg bg-white rounded-2xl shadow p-8 text-center">
          <h2 className="text-2xl font-semibold mb-2">Login first</h2>
          <p className="text-sm text-slate-600 mb-4">You must be logged in to host an event.</p>
          <a href="/login" className="inline-flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 text-white">Go to Login</a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.14),_transparent_34%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] text-slate-900">
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex rounded-full border border-indigo-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700 shadow-sm backdrop-blur">
            Host event
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Create an event that is ready to publish</h1>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            Fill in the exact fields required by the backend model so your event can be created without extra cleanup.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <form className="space-y-10 p-6 sm:p-8 lg:p-10" onSubmit={handleSubmit}>
            <section className="space-y-5">
              <div className="text-lg font-semibold text-slate-950">1. Event Details</div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Event Title</span>
                  <input
                    type="text"
                    placeholder="Enter a clear, searchable event title"
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Mode</span>
                  <select
                    value={form.mode}
                    onChange={(event) => updateField("mode", event.target.value)}
                    className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Event Date</span>
                  <input
                    type="datetime-local"
                    value={form.date}
                    onChange={(event) => updateField("date", event.target.value)}
                    className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Description</span>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  placeholder="Describe what the event is about, who it is for, and what attendees should expect"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                />
              </label>
            </section>

            <section className="space-y-5">
              <div className="text-lg font-semibold text-slate-950">2. Location and Images</div>

              <label className="block space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Location</span>
                <input
                  type="text"
                  value={form.location}
                  onChange={(event) => updateField("location", event.target.value)}
                  placeholder="Full address or meeting link"
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Google Map Link</span>
                <input
                  type="url"
                  value={form.googleMapLink}
                  onChange={(event) => updateField("googleMapLink", event.target.value)}
                  placeholder="Paste a Google Maps share or embed link"
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                />
                <p className="text-xs text-slate-500">Use a Google Maps link so attendees can open the venue directly from the event page.</p>
              </label>

              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Map Preview</div>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {mapPreviewUrl ? (
                    <iframe
                      title="Google map preview"
                      src={mapPreviewUrl}
                      className="h-80 w-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : form.googleMapLink.trim() ? (
                    <div className="flex h-80 flex-col items-center justify-center gap-3 px-6 text-center text-sm text-slate-500">
                      <p>This Google Maps share link cannot be embedded directly.</p>
                      <p>Use a full Google Maps place or directions URL for the preview, or open the link in a new tab.</p>
                      <a
                        href={form.googleMapLink.trim()}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-indigo-200 bg-white px-4 py-2 font-semibold text-indigo-700 transition-colors hover:bg-indigo-50"
                      >
                        Open map link
                      </a>
                    </div>
                  ) : (
                    <div className="flex h-80 items-center justify-center px-6 text-center text-sm text-slate-500">
                      Paste a Google Maps link to preview the venue map here.
                    </div>
                  )}
                </div>
              </div>

              <label className="block space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Upload Images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                />
                <p className="text-xs text-slate-500">Images are uploaded to Cloudinary first, then the returned links are saved in the event record.</p>
                <p className="text-xs text-slate-500">The first image is treated as the thumbnail and is stored at index 0 in the images array.</p>
                {isUploadingImage ? <p className="text-xs font-medium text-indigo-600">Uploading image...</p> : null}
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {form.images.map((image, index) => (
                    <div key={`${image}-${index}`} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                      <div className="relative aspect-[4/3] bg-slate-100">
                        <img src={image} alt={`Uploaded ${index + 1}`} className="h-full w-full object-cover" />
                        {index === 0 ? (
                          <span className="absolute left-2 top-2 rounded-full bg-indigo-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm">
                            Thumbnail
                          </span>
                        ) : null}
                      </div>
                      <div className="space-y-3 p-3">
                        <p className="truncate text-xs text-slate-500">{image}</p>
                        <div className="flex flex-wrap gap-2">
                          {index !== 0 ? (
                            <button
                              type="button"
                              onClick={() => setThumbnailImage(index)}
                              className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
                            >
                              Make thumbnail
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </label>
            </section>

            <section className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold text-slate-950">3. Contact</div>
                  <p className="text-sm text-slate-500">Add one or more contacts for guests to reach out to.</p>
                </div>
                <button
                  type="button"
                  onClick={addContact}
                  className="rounded-md border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
                >
                  Add contact
                </button>
              </div>

              <div className="space-y-4">
                {form.contact.map((item, index) => (
                  <div key={`contact-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
                      <label className="block space-y-2">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Name</span>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(event) => updateContact(index, "name", event.target.value)}
                          placeholder="Host name"
                          className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                        />
                      </label>

                      <label className="block space-y-2">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Email</span>
                        <input
                          type="email"
                          value={item.email}
                          onChange={(event) => updateContact(index, "email", event.target.value)}
                          placeholder="host@example.com"
                          className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                        />
                      </label>

                      <label className="block space-y-2">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Phone</span>
                        <input
                          type="tel"
                          value={item.phone}
                          onChange={(event) => updateContact(index, "phone", event.target.value)}
                          placeholder="+1 555 000 0000"
                          className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => removeContact(index)}
                        className="h-11 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold text-slate-950">4. Timeline</div>
                  <p className="text-sm text-slate-500">Use this to show what happens and when, like guest arrival, ceremony, or reception start time.</p>
                </div>
                <button
                  type="button"
                  onClick={addTimelineItem}
                  className="rounded-md border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
                >
                  Add timeline item
                </button>
              </div>

              <div className="space-y-4">
                {form.timeline.map((item, index) => (
                  <div key={`timeline-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="grid gap-4 lg:grid-cols-[1fr_1fr_220px_140px_auto] lg:items-end">
                      <label className="block space-y-2">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Title</span>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(event) => updateTimeline(index, "title", event.target.value)}
                          placeholder="Main guest arrives"
                          className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                        />
                      </label>

                      <label className="block space-y-2">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Description</span>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(event) => updateTimeline(index, "description", event.target.value)}
                          placeholder="Guest arrives at venue entrance"
                          className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                        />
                      </label>

                      <label className="block space-y-2">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Time</span>
                        <input
                          type="datetime-local"
                          value={item.timestamp}
                          onChange={(event) => updateTimeline(index, "timestamp", event.target.value)}
                          className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                        />
                      </label>

                      <label className="block space-y-2">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Status</span>
                        <select
                          value={item.status}
                          onChange={(event) => updateTimeline(index, "status", event.target.value)}
                          className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </label>

                      <button
                        type="button"
                        onClick={() => removeTimelineItem(index)}
                        className="h-11 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 p-4">
                <div className="mb-3 text-sm font-semibold text-indigo-800">Live timeline preview</div>
                <div className="space-y-3">
                  {form.timeline.map((item, index) => (
                    <div key={`timeline-preview-${index}`} className="flex items-start gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
                      <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-slate-950">{item.title || "Timeline item"}</p>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                            {item.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{item.description || "Add a short description for guests"}</p>
                        <p className="mt-1 text-xs font-medium text-indigo-700">
                          {item.timestamp ? formatUtcDateTime(item.timestamp) : "Set a time to show the schedule"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold text-slate-950">5. FAQs</div>
                  <p className="text-sm text-slate-500">Optional, but useful if attendees usually ask the same questions.</p>
                </div>
                <button
                  type="button"
                  onClick={addFaq}
                  className="rounded-md border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
                >
                  Add FAQ
                </button>
              </div>

              <div className="space-y-4">
                {form.faqs.map((faq, index) => (
                  <div key={`faq-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
                      <label className="block space-y-2">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Question</span>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(event) => updateFaq(index, "question", event.target.value)}
                          placeholder="What should guests know?"
                          className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                        />
                      </label>

                      <label className="block space-y-2">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Answer</span>
                        <input
                          type="text"
                          value={faq.answer}
                          onChange={(event) => updateFaq(index, "answer", event.target.value)}
                          placeholder="Write the answer here"
                          className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => removeFaq(index)}
                        className="h-11 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploadingImage || !userLoggedIn}
                className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Publishing..." : "Publish Event"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <div className="text-sm font-semibold text-indigo-600">GatherPulse</div>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="hover:text-indigo-600">About Us</a>
            <a href="#" className="hover:text-indigo-600">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600">Contact Support</a>
          </div>
          <div>© 2024 GatherPulse. All rights reserved.</div>
        </div>
      </footer>
    </main>
  )
}