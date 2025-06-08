import React, { useState } from 'react';
import meetup1 from '../../assets/images/meetup-1.jpg';
import meetup4 from '../../assets/images/meetup-4.jpg';
import meetup5 from '../../assets/images/meetup-5.jpg';
import meetup6 from '../../assets/images/meetup-6.jpg';
import HeroCarousel from '../../components/common/HeroCarousel';

const AboutPage: React.FC = () => {
  const heroSlides = [
    {
      title: "Hi, we're TrustHaven",
      description: "Meet the dedicated team turning years of expertise into a seamless client-project communication experience. Your trust, our mission.",
      imageUrl: meetup1,
    },
    {
      title: "Verified Listings, Trusted Transactions",
      description: "We connect buyers and sellers with confidence, offering verified listings for homes, cars, and services across Cameroon.",
      imageUrl: meetup4,
    },
    {
      title: "Innovation Through Community",
      description: "Founded by CodersHub, a community of innovators, we actively seek problems and find appropriate solutions through technology.",
      imageUrl: meetup5,
    },
  ];

  const [currentBackgroundImage, setCurrentBackgroundImage] = useState(heroSlides[0].imageUrl);

  const handleSlideChange = (newIndex: number) => {
    setCurrentBackgroundImage(heroSlides[newIndex].imageUrl);
  };

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden py-24 md:py-32 px-4 md:px-8 text-center shadow-lg"
        style={{
          backgroundImage: `url(${currentBackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transition: 'background-image 0.7s ease-in-out', // Smooth transition
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-white mb-3">
            About Us
          </p>
          <HeroCarousel slides={heroSlides} onSlideChange={handleSlideChange} />
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-white">
        <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row items-center gap-16 md:gap-20">
          {/* Left Column */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6 max-w-xl">
              TrustHaven was founded by <br className="hidden md:inline" /><span className="text-primary">CodersHub</span>,
              <br />
              a community of innovators actively <br className="hidden md:inline" />looking for problems and finding solutions.
            </h2>
            {/* CodersHub Illustration */}
            <div className="w-full max-w-sm mx-auto lg:mx-0 mt-12">
              <img 
                src={meetup1} 
                alt="CodersHub community collaboration" 
                className="w-full h-auto object-contain rounded-lg shadow-md" 
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:w-1/2 space-y-6 text-gray-700">
            <p>
              Born from the innovative spirit of CodersHub, TrustHaven represents
              our commitment to solving real-world challenges through technology.
              As a community of passionate developers and problem-solvers, we
              identified a critical need for a trusted platform in Cameroon's
              marketplace.
            </p>
            <p>
              Our journey began with a simple observation: the lack of trust and
              verification in online marketplaces was preventing people from
              confidently buying, selling, and trading in their communities.
            </p>
            <p>
              Rather than just identifying the problem, we took action. Our team
              of innovators came together to create a solution that would
              <strong className="text-gray-900"> revolutionize how people interact
              in the marketplace, bringing trust and security to every transaction.</strong>
            </p>
            <p>
              Today, TrustHaven stands as a testament to CodersHub's mission:
              to actively seek out problems in our community and develop
              innovative solutions that make a real difference in people's lives.
            </p>
            <p>
              We're proud to continue building on this foundation, constantly
              innovating and improving our platform to better serve our users.
            </p>
            <p className="font-semibold italic text-gray-900">
              Innovation through community, trust through technology.
            </p>
          </div>
        </div>
      </section>

      {/* The Credo Section */}
      <section className="py-20 md:py-24 px-4 md:px-8 bg-white shadow-md">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 text-center lg:text-left max-w-4xl mx-auto lg:mx-0">
            The TrustHaven Credo
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto lg:mx-0 mb-16 text-center lg:text-left">
            Our culture isn't something we keep to ourselves. Our culture is
            baked into every feature of TrustHaven. Because the keys to our
            success are yours, too.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            {/* Left Column for Credo points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Efficiency</h3>
                <p className="text-gray-700 leading-relaxed">
                  Working smarter, not harder is what
                  it's all about. Saving time, stressing
                  less, and working better together.
                  Efficiency keeps day-to-day tasks
                  and communication virtually
                  frictionless.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Empowerment</h3>
                <p className="text-gray-700 leading-relaxed">
                  We empower each other to show
                  up and do our best work every
                  single day. Inside TrustHaven, we
                  give you the tools to take the reins
                  on projects and provide amazing
                  client experiences.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Transparency</h3>
                <p className="text-gray-700 leading-relaxed">
                  We believe in keeping values and
                  processes transparent for one
                  reason: to earn and build trust
                  amongst team members, clients,
                  and partners.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
                <p className="text-gray-700 leading-relaxed">
                  If change is constant, so is
                  Innovation. Every feature inside
                  TrustHaven only gets better, just like
                  your processes. When you grow,
                  TrustHaven grows with you.
                </p>
              </div>
            </div>

            {/* Right Column for Lighthouse Illustration */}
            <div className="flex justify-center items-center lg:justify-end">
              <img 
                src={meetup5} 
                alt="Students collaborating in a classroom environment" 
                className="w-full max-w-md h-auto object-contain rounded-lg shadow-md" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gray-50 py-20 md:py-24 px-4 md:px-8 text-center shadow-lg">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 max-w-4xl mx-auto">
            Ready to transform your client relationships?
            <br className="hidden sm:inline" />
            Discover TrustHaven today!
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Experience a new level of collaboration and efficiency. Join thousands of satisfied users.
          </p>
          <button className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full text-xl transition-colors duration-200 shadow-lg mb-16">
            Get Started—It's FREE
          </button>
          {/* Bottom Illustration */}
          <div className="w-full max-w-lg mx-auto">
            <img
              src={meetup4}
              alt="Diverse team collaboration and success"
              className="w-full h-auto object-contain rounded-lg shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 md:py-24 px-4 md:px-8 bg-white shadow-md">
        <div className="container mx-auto max-w-7xl text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 max-w-4xl mx-auto">
            Meet Our Amazing Team
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-16">
            We're in the business of efficiency and collaboration. Get to know the
            passionate founders and talented team leaders making TrustHaven a reality.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-12 gap-x-8 max-w-6xl mx-auto">
            {/* Team Member 1: Excel */}
            <div className="flex flex-col items-center shadow-md rounded-lg p-6">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-md overflow-hidden">
                <img 
                  src="/src/assets/images/excel.jpg" 
                  alt="Excel Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Afoumbom Excel</h3>
              <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-3">Chief Financial Officer</p>
              <p className="text-gray-700 leading-relaxed text-sm max-w-xs text-center">
                Excel manages the financial operations and strategies of TrustHaven.
              </p>
            </div>

            {/* Team Member 2: Adrian */}
            <div className="flex flex-col items-center shadow-md rounded-lg p-6">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-md overflow-hidden">
                <img 
                  src="/src/assets/images/adrian.jpg" 
                  alt="Adrian Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Ebesoh Adrian</h3>
              <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-3">Chief Executive Officer</p>
              <p className="text-gray-700 leading-relaxed text-sm max-w-xs text-center">
                Adrian leads TrustHaven's vision and overall strategic direction.
              </p>
            </div>

            {/* Team Member 3: Henry */}
            <div className="flex flex-col items-center shadow-md rounded-lg p-6">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-md overflow-hidden">
                <img 
                  src="/src/assets/images/henry.jpg" 
                  alt="Henry Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Ikomi Henry</h3>
              <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-3">Chief Technology Officer</p>
              <p className="text-gray-700 leading-relaxed text-sm max-w-xs text-center">
                Henry oversees all technological development and innovation at TrustHaven.
              </p>
            </div>

            {/* Team Member 4: Nellyvone */}
            <div className="flex flex-col items-center shadow-md rounded-lg p-6">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-md overflow-hidden">
                <img 
                  src="/src/assets/images/nellyvone.jpg" 
                  alt="Nellyvone Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Ndum Nellyvonne</h3>
              <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-3">Chief Operations Officer</p>
              <p className="text-gray-700 leading-relaxed text-sm max-w-xs text-center">
                Nellyvonne ensures the smooth and efficient daily operations of TrustHaven.
              </p>
            </div>

            {/* Team Member 5: Keziah */}
            <div className="flex flex-col items-center shadow-md rounded-lg p-6">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-md overflow-hidden">
                <img 
                  src="/src/assets/images/keziah.jpg" 
                  alt="Keziah Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Ebaneck Keziah</h3>
              <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-3">Chief Marketing Officer</p>
              <p className="text-gray-700 leading-relaxed text-sm max-w-xs text-center">
                Keziah fosters a vibrant and engaged community around TrustHaven, ensuring strong client relationships.
              </p>
            </div>

            {/* Team Member 6: Foven Giselle */}
            <div className="flex flex-col items-center shadow-md rounded-lg p-6">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-md overflow-hidden">
                <img 
                  src="/src/assets/images/giselle.jpg" 
                  alt="Foven Giselle Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Foven Giselle</h3>
              <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-3">Secretary</p>
              <p className="text-gray-700 leading-relaxed text-sm max-w-xs text-center">
                Foven Giselle is responsible for administrative support and ensuring smooth communication within the team.
              </p>
            </div>

            {/* Team Member 7: Noah Holion */}
            <div className="flex flex-col items-center shadow-md rounded-lg p-6">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-md overflow-hidden">
                <img 
                  src="/src/assets/images/noah.jpg" 
                  alt="Noah Holion Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Noah Holion</h3>
              <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-3">Developer and Content Strategist</p>
              <p className="text-gray-700 leading-relaxed text-sm max-w-xs text-center">
                Noah combines coding expertise with strategic content creation to enhance TrustHaven's digital presence.
              </p>
            </div>

            {/* Team Member 8: Philippe Gael */}
            <div className="flex flex-col items-center shadow-md rounded-lg p-6">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-md overflow-hidden">
                <img 
                  src="/src/assets/images/philip.jpg" 
                  alt="Philippe Gael Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Philippe Gael</h3>
              <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-3">Senior Developer</p>
              <p className="text-gray-700 leading-relaxed text-sm max-w-xs text-center">
                Philippe leads complex development projects and mentors junior developers at TrustHaven.
              </p>
            </div>

            {/* Team Member 8: Baboule Bonneck */}
            <div className="flex flex-col items-center shadow-md rounded-lg p-6">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-md overflow-hidden">
                <img 
                  src="/src/assets/images/babs.jpg" 
                  alt="Baboule Bonneck Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Baboule Bonneck</h3>
              <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-3">Human Resource Manager</p>
              <p className="text-gray-700 leading-relaxed text-sm max-w-xs text-center">
                Baboule is responsible for managing human resources and fostering a positive work environment at TrustHaven.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-20 px-4 md:px-8 bg-gray-50 text-center shadow-md">
        {/* Illustration */}
        <div className="w-full max-w-lg mx-auto mb-12">
          <img 
            src={meetup6} 
            alt="Diverse team collaboration and success" 
            className="w-full h-auto object-contain rounded-lg shadow-md" 
          />
        </div>

        <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">Get Started Today</p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-8 max-w-3xl mx-auto">
          Change the way you <br className="hidden sm:inline" />work with clients forever
        </h2>
        <button className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-200 shadow-md mb-4">
          Get Started—It's FREE
        </button>
        <p className="text-xs text-gray-500">
          No credit card required. Cancel any time.
        </p>
      </section>
    </div>
  );
};

export default AboutPage;