import Auth from "../components/Auth";
import Footer from "../components/Footer";
import Header from "../components/Header";


const Authentication = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <div>
          <Auth />
        </div>
      </main>
      <Footer />
    </div>
  )
}
export default Authentication;
