import React from 'react';
import Hero from '../components/home/Hero';
import CategorySection from '../components/home/CategorySection';
import FeaturedListings from '../components/home/FeaturedListings';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';
import StepInfographic from '../components/home/StepInfographic';
import JoinCommunity from '../components/home/JoinCommunity';
// import CoolBackground from '../components/home/CoolBackground';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* <CoolBackground className="flex items-center justify-center text-center"> */}
        <Hero />
        <CategorySection />
        <FeaturedListings />
        <HowItWorks />
        <StepInfographic />
        <Testimonials />
        <JoinCommunity />
      {/* </CoolBackground> */}
    </div>
  );
};

export default HomePage;