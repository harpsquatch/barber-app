
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import BookingForm from '@/components/BookingForm';
import GallerySection from '@/components/GallerySection';
import AboutSection from '@/components/AboutSection';
import PricingSection from '@/components/PricingSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <BookingForm />
      <GallerySection />
      <AboutSection />
      <PricingSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
