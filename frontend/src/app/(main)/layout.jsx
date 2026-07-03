import Navbar from '@/components/Navbar'

const layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="min-h-full flex flex-col">{children}</main>
    </>
  )
}

export default layout