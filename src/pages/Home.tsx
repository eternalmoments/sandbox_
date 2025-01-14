import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import SiteExamples from '../components/SiteExamples';
import Footer from '../components/Footer';
import StarBackground from '../components/StarBackground';
import Counter from '../components/Counter';
import Testimonials from '../components/Testimonials';

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <StarBackground />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Counter />
        <Testimonials />
        <SiteExamples />
        <Footer />
      </div>
    </div>
  );
}