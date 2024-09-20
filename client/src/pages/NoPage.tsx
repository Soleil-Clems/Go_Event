import Header from '../components/Header'
import Footer from '../components/Footer'

export default function NoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
    <Header />
    <main className="flex-grow container mx-auto p-4">
        <h1>404</h1>
    </main>
    <Footer />
</div>
  )
}
