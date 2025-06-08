import React from 'react';
import { Facebook, Twitter, Linkedin, MessageCircle } from 'lucide-react';

const platforms = [
  {
    icon: <MessageCircle className="w-10 h-10 text-primary" />,
    title: 'WhatsApp',
    description: 'Join our WhatsApp group for real-time updates and community support.',
    link: 'https://wa.me/your-group-link',
    cta: 'Join WhatsApp',
  },
  {
    icon: <Facebook className="w-10 h-10 text-primary" />,
    title: 'Facebook',
    description: 'Follow us on Facebook for news, tips, and community stories.',
    link: 'https://facebook.com/your-page',
    cta: 'Follow on Facebook',
  },
  {
    icon: <Twitter className="w-10 h-10 text-primary" />,
    title: 'Twitter',
    description: 'Get the latest updates and engage with us on Twitter.',
    link: 'https://twitter.com/your-handle',
    cta: 'Follow on Twitter',
  },
  {
    icon: <Linkedin className="w-10 h-10 text-primary" />,
    title: 'LinkedIn',
    description: 'Connect with us on LinkedIn for professional networking and opportunities.',
    link: 'https://linkedin.com/company/your-company',
    cta: 'Connect on LinkedIn',
  },
];

const JoinCommunity: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm mb-2 block">Community Engagement</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Join the Community</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Become a part of our thriving community, where you can connect with like-minded individuals, collaborate on projects, and grow together.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {platforms.map((platform, idx) => (
            <div key={idx} className="bg-gray-50 rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
              {platform.icon}
              <h3 className="text-lg font-bold mt-4 mb-2 text-gray-900">{platform.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{platform.description}</p>
              <a
                href={platform.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline"
              >
                {platform.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JoinCommunity; 