import React from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Emmanuel Fongoh',
    location: 'Buea',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 5,
    text: 'I found my apartment through TrustHaven and the process was seamless. The verification system gave me confidence that I was dealing with legitimate listings.',
    date: '2023-08-15'
  },
  {
    id: '2',
    name: 'Blessing Nkongho',
    location: 'Douala',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4,
    text: 'As a business owner, TrustHaven has helped me reach more customers in Cameroon. The platform is easy to use and the customer service is excellent.',
    date: '2023-07-22'
  },
  {
    id: '3',
    name: 'Jean-Pierre Moukam',
    location: 'Yaoundé',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 5,
    text: 'I sold my car within a week of listing it on TrustHaven. The verification process helped build trust with potential buyers. Highly recommended!',
    date: '2023-09-03'
  }
];

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full">
      <div className="flex items-center mb-4">
        <img 
          src={testimonial.avatar} 
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
          <p className="text-sm text-gray-600">{testimonial.location}</p>
        </div>
      </div>
      
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
          />
        ))}
      </div>
      
      <div className="relative flex-1">
        <Quote className="absolute -top-2 -left-2 w-6 h-6 text-primary opacity-20" />
        <p className="text-gray-700 italic relative z-10">
          &quot;{testimonial.text}&quot;
        </p>
      </div>
      
      <p className="text-xs text-gray-500 mt-4">
        {new Date(testimonial.date).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </p>
    </div>
  );
};

const Testimonials: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Read testimonials from people who have found success using TrustHaven
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;