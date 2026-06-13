import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import TrustedBy from "../components/home/TrustedBy";
import Features from "../components/home/Features";
import CTA from "../components/home/CTA";
import Footer from "../components/layout/Footer";
const Home = () => {
  return (
    <div className="bg-slate-950">
      <Navbar />
      <Hero />
      <TrustedBy/>
      <Features/>
      <CTA />
      <Footer />


    </div>
  );
};

export default Home;