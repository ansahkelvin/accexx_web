import Hero from "@/components/sections/Hero";
import Steps from "@/components/sections/Steps";
import Services from "@/components/sections/Services";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import MentalHealthSection from "@/components/sections/MentalHealth";
import NewsletterSection from "@/components/card/NewsletterSection";

export default function Home() {
  return (
    <div className="">
        <Hero/>
        <Steps/>
        <Services/>
        <WhyChooseUs/>
        <MentalHealthSection/>
        <NewsletterSection/>
    </div>
  );
}
