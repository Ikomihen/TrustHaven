import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';

const countries = [
  { code: '+237', flag: '🇨🇲' },
  { code: '+234', flag: '🇳🇬' },
  { code: '+33', flag: '🇫🇷' },
  { code: '+1', flag: '🇺🇸' },
];

const interests = [
  'General Inquiry',
  'Support',
  'Partnership',
  'Feedback',
  'Other',
];

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    country: countries[0].code,
    phone: '',
    interest: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, country: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual submission logic
    alert('Message sent!');
  };

  return (
    <div className="bg-gray-50 min-h-[80vh] flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full mx-auto text-center mb-8 mt-6">
        <div className="text-sm text-gray-500 mb-2">TrustHaven &bull; Contact us</div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contact us</h1>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Get in touch and ask us anything. Whether you have questions about listings, partnerships, or need support, our team is here to help.
        </p>
      </div>
      {/* Illustrations (placeholders) for mobile: red on top, blue on bottom */}
      {/* Mobile: Red illustration above form */}
      <div className="block md:hidden w-full flex justify-center mb-6 animate-float" style={{ animationDelay: '1.5s' }}>
        <svg width="120" height="120" fill="none" viewBox="0 0 120 120"><circle cx="60" cy="60" r="60" fill="#E25141" fillOpacity="0.1" /><rect x="30" y="80" width="60" height="10" rx="5" fill="#E25141" /><rect x="40" y="40" width="40" height="40" rx="20" fill="#E25141" /></svg>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl mx-auto flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-gray-900 bg-gray-50"
          />
          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-gray-900 bg-gray-50"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label htmlFor="country" className="sr-only">Country code</label>
          <div className="flex">
            <select
              id="country"
              name="country"
              value={form.country}
              onChange={handleCountryChange}
              className="rounded-l-lg border border-gray-300 bg-gray-50 px-3 py-3 focus:ring-2 focus:ring-primary focus:outline-none text-gray-900"
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
              ))}
            </select>
            <input
              name="phone"
              type="tel"
              placeholder="6XX XXX XXX"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-t border-b border-r border-gray-300 rounded-r-lg focus:ring-2 focus:ring-primary focus:outline-none text-gray-900 bg-gray-50"
              style={{ minWidth: 0 }}
            />
          </div>
          <label htmlFor="interest" className="sr-only">Interest</label>
          <select
            id="interest"
            name="interest"
            value={form.interest}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-gray-900 bg-gray-50"
          >
            <option value="">Interested in</option>
            {interests.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>
        <textarea
          name="message"
          placeholder="How can we help?"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-gray-900 bg-gray-50 resize-none"
        />
        <Button type="submit" className="w-full py-3 text-lg rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors duration-200">
          Send your message
        </Button>
        <div className="text-xs text-gray-500 text-center mt-2">
          By clicking, you agree to our <a href="/terms" className="underline text-primary">Terms & Conditions</a> and <a href="/privacy" className="underline text-primary">Privacy Policy</a>.
        </div>
      </form>
      {/* Mobile: Blue illustration below form */}
      <div className="block md:hidden w-full flex justify-center mt-6 animate-float">
        <svg width="120" height="120" fill="none" viewBox="0 0 120 120"><circle cx="60" cy="60" r="60" fill="#37bce5" fillOpacity="0.1" /><rect x="30" y="80" width="60" height="10" rx="5" fill="#37bce5" /><rect x="40" y="40" width="40" height="40" rx="20" fill="#37bce5" /></svg>
      </div>
      {/* Illustrations (placeholders) for desktop: left/right */}
      <div className="w-full justify-between mt-8 max-w-4xl mx-auto hidden md:flex">
        <style>{`
          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-18px); }
            100% { transform: translateY(0); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
        <div className="animate-float">
          <svg width="120" height="120" fill="none" viewBox="0 0 120 120"><circle cx="60" cy="60" r="60" fill="#37bce5" fillOpacity="0.1" /><rect x="30" y="80" width="60" height="10" rx="5" fill="#37bce5" /><rect x="40" y="40" width="40" height="40" rx="20" fill="#37bce5" /></svg>
        </div>
        <div className="animate-float" style={{ animationDelay: '1.5s' }}>
          <svg width="120" height="120" fill="none" viewBox="0 0 120 120"><circle cx="60" cy="60" r="60" fill="#E25141" fillOpacity="0.1" /><rect x="30" y="80" width="60" height="10" rx="5" fill="#E25141" /><rect x="40" y="40" width="40" height="40" rx="20" fill="#E25141" /></svg>
        </div>
      </div>

      {/* Get in touch section with map and contact info */}
      <section className="w-full max-w-4xl mx-auto mt-16">
        <div className="text-center mb-8">
          <div className="text-sm text-gray-500 mb-2">OUR OFFICES</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Get in touch with TrustHaven</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-stretch">
          {/* Cameroon Google Map */}
          <div className="flex-1 min-w-[300px] h-96 rounded-xl overflow-hidden shadow">
            <iframe
              title="TrustHaven Cameroon Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.668964024052!2d9.29975931475313!3d4.155083896003998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x106132c7e2e2e2e3%3A0x7e2e2e2e2e2e2e2e!2sBuea%2C%20Cameroon!5e0!3m2!1sen!2s!4v1680000000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          {/* Contact Info */}
          <div className="flex-1 bg-gray-100 rounded-xl shadow p-6 flex flex-col justify-between min-w-[250px]">
            <div>
              <div className="mb-4">
                <div className="text-gray-700 font-semibold">Address</div>
                <div className="text-gray-900">Molyko, Buea, Southwest Region, Cameroon</div>
              </div>
              <div className="mb-4">
                <div className="text-gray-700 font-semibold">Email</div>
                <a href="mailto:contact@trusthaven.cm" className="text-primary underline">contact@trusthaven.cm</a>
              </div>
              <div className="mb-4">
                <div className="text-gray-700 font-semibold">Phone</div>
                <a href="tel:+237670123456" className="text-primary underline">+237 670 123 456</a>
              </div>
            </div>
            <div className="flex gap-8 mt-4">
              {/* Mobile: brand colors */}
              <a href="#" aria-label="Facebook" className="block md:hidden" style={{ color: '#1877F3' }}><svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg></a>
              <a href="#" aria-label="Twitter" className="block md:hidden" style={{ color: '#1DA1F2' }}><svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.938-.856 2.021-.857 3.17 0 2.188 1.115 4.117 2.823 5.254a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.058 0 14.009-7.496 14.009-13.986 0-.21 0-.423-.016-.634A9.936 9.936 0 0 0 24 4.557z"/></svg></a>
              <a href="#" aria-label="Instagram" className="block md:hidden" style={{ color: '#E4405F' }}><svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.775.13 4.602.402 3.635 1.37 2.668 2.337 2.396 3.51 2.338 4.788.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.058 1.277.33 2.45 1.297 3.417.967.967 2.14 1.239 3.417 1.297C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.277-.058 2.45-.33 3.417-1.297.967-.967 1.239-2.14 1.297-3.417.058-1.28.072-1.689.072-4.948s-.014-3.668-.072-4.948c-.058-1.277-.33-2.45-1.297-3.417-.967-.967-2.14-1.239-3.417-1.297C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg></a>
              {/* Desktop: gray with hover */}
              <a href="#" aria-label="Facebook" className="hidden md:block text-gray-400 hover:text-blue-500 transition-colors duration-300"><svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg></a>
              <a href="#" aria-label="Twitter" className="hidden md:block text-gray-400 hover:text-blue-400 transition-colors duration-300"><svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.938-.856 2.021-.857 3.17 0 2.188 1.115 4.117 2.823 5.254a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.058 0 14.009-7.496 14.009-13.986 0-.21 0-.423-.016-.634A9.936 9.936 0 0 0 24 4.557z"/></svg></a>
              <a href="#" aria-label="Instagram" className="hidden md:block text-gray-400 hover:text-pink-500 transition-colors duration-300"><svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.775.13 4.602.402 3.635 1.37 2.668 2.337 2.396 3.51 2.338 4.788.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.058 1.277.33 2.45 1.297 3.417.967.967 2.14 1.239 3.417 1.297C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.277-.058 2.45-.33 3.417-1.297.967-.967 1.239-2.14 1.297-3.417.058-1.28.072-1.689.072-4.948s-.014-3.668-.072-4.948c-.058-1.277-.33-2.45-1.297-3.417-.967-.967-2.14-1.239-3.417-1.297C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg></a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;