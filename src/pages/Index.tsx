import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TabsNavigation from "@/components/TabsContent";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Navbar />
      <main>
        <HeroSection />
        <TabsNavigation />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
