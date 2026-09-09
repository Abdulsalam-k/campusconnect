import Hero from "../components/Hero";
import PlatformStats from "../components/PlatformStats";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import FeaturedOpportunities from "../components/FeaturedOpportunities";
import StudentSpotlight from "../components/StudentSpotlight";
import RecruiterCTA from "../components/RecruiterCTA";
import FinalCTA from "../components/FinalCTA";

function Home() {
  return (
    <div>
      <Hero />
      <PlatformStats />
      <HowItWorks />
      <Features />
      <FeaturedOpportunities />
      <StudentSpotlight />
      <RecruiterCTA />
      <FinalCTA />
    </div>
  );
}

export default Home;