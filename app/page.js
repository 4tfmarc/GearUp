'use client';
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        {/* Hero Section with Image Background */}
        <div className="relative h-[75vh] bg-gray-900">
          <Image
            src="/images/hero.jpg"
            alt="Hero motorcycle gear"
            fill           
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-4xl">
              <h1 className="text-6xl font-bold mb-6 leading-tight">
                Experience the Ultimate in Riding Protection
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                Discover premium gear crafted for the passionate rider. From track to trail,
                we've got you covered.
              </p>
              <div className="flex gap-4 justify-center">
                {user ? (
                  <>
                    <a href="/shop" className="bg-red-600 text-white px-8 py-4 rounded-md font-semibold hover:bg-red-700 transition-colors">
                      Shop Collection
                    </a>
                    
                  </>
                ) : (
                  <>
                    <a href="/signin" className="bg-red-600 text-white px-8 py-4 rounded-md font-semibold hover:bg-red-700 transition-colors">
                      Get Started
                    </a>
                    <a href="/shop" className="border-2 border-white text-white px-8 py-4 rounded-md font-semibold hover:bg-white hover:text-black transition-all">
                      Shop Collection
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Banner */}
        <section className="bg-white py-4 md:py-6 border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-center">
              <div className="p-2">
                <div className="mb-2 text-red-600">
                  <svg className="w-5 h-5 md:w-6 md:h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xs md:text-sm mb-1">Same Day Shipping</h3>
                <p className="text-gray-600 text-xs hidden sm:block">Order by 2PM for same day dispatch</p>
              </div>
              <div className="p-2">
                <div className="mb-2 text-red-600">
                  <svg className="w-5 h-5 md:w-6 md:h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xs md:text-sm mb-1">2-Year Warranty</h3>
                <p className="text-gray-600 text-xs hidden sm:block">Extended protection on all gear</p>
              </div>
              <div className="p-2">
                <div className="mb-2 text-red-600">
                  <svg className="w-5 h-5 md:w-6 md:h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xs md:text-sm mb-1">Free Returns</h3>
                <p className="text-gray-600 text-xs hidden sm:block">60-day hassle-free returns</p>
              </div>
              <div className="p-2">
                <div className="mb-2 text-red-600">
                  <svg className="w-5 h-5 md:w-6 md:h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xs md:text-sm mb-1">Expert Support</h3>
                <p className="text-gray-600 text-xs hidden sm:block">24/7 rider assistance</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16">Premium Selection</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {['Racing Helmets', 'Leather Jackets', 'Boots', 'Accessories'].map((category) => (
                <a
                  href={`/shop?category=${category.toLowerCase().replace(' ', '-')}`}
                  key={category}
                  className="group cursor-pointer"
                >
                  <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden rounded-lg">
                    <Image
                      src={`/images/${category.toLowerCase().replace(' ', '-')}.jpg`}
                      alt={category}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 p-4 md:p-6 text-white">
                      <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">{category}</h3>
                      <span className="text-xs md:text-sm text-gray-300">Explore Collection →</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

      {/* Brand Partners */}
        <section className="py-4 bg-white overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-4">Official Partner of Leading Brands</h2>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
              {[
                { name: 'shoei-logo', ext: 'png' },
                { name: 'alpinestars-logo', ext: 'jpg' },
                { name: 'Dainese-Logo', ext: 'jpg' },
                { name: 'AGV_logo', ext: 'png' },
                { name: 'Arai_Logo', ext: 'png' }
              ].map((brand) => (
                <div key={brand.name} className="w-[70px] md:w-[100px] h-[40px] md:h-[50px] flex items-center justify-center">
                  <Image
                    src={`/images/brands/${brand.name}.${brand.ext}`}
                    alt={`${brand.name} logo`}
                    width={80}
                    height={50}
                    className="max-w-full max-h-full object-contain opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety Commitment */}
        <section className="py-8 md:py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                Our Commitment to Your Safety
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto text-xs md:text-sm">
                Every piece of gear we stock undergoes rigorous testing and certification processes.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[
                {
                  stat: '15,000+',
                  label: 'Impact Tests Performed',
                  description: 'Every helmet model undergoes multiple impact scenarios',
                  color: 'from-red-500 to-red-700'
                },
                {
                  stat: '100%',
                  label: 'Safety Certification Rate',
                  description: 'All gear meets or exceeds safety standards',
                  color: 'from-orange-500 to-red-500'
                },
                {
                  stat: '2X',
                  label: 'Industry Standard',
                  description: 'Our testing exceeds required safety margins',
                  color: 'from-yellow-500 to-orange-500'
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className="group relative p-4 md:p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 
                           border border-gray-700 hover:border-gray-600 transition-all duration-300
                           hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1"
                >
                  <div className={`absolute top-0 left-0 h-0.5 w-0 group-hover:w-full 
                                transition-all duration-700 bg-gradient-to-r ${item.color}`} />
                  <div className="flex flex-col items-center text-center space-y-1 md:space-y-2">
                    <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent 
                                bg-gradient-to-r from-white to-gray-300">
                      {item.stat}
                    </div>
                    <h3 className="text-sm md:text-base font-semibold">{item.label}</h3>
                    <p className="text-gray-400 text-xs">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 md:mt-12 grid md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-3 md:space-y-4">
                <h3 className="text-lg md:text-xl font-bold">Industry-Leading Standards</h3>
                {[
                  'Triple-layer impact absorption testing',
                  'Advanced abrasion resistance certification',
                  'Thermal stability validation',
                  'Weather resistance verification'
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 md:p-3 rounded-lg bg-gray-800/50 
                             hover:bg-gray-800 transition-colors group cursor-pointer"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 group-hover:scale-150 transition-transform" />
                    <span className="text-xs md:text-sm group-hover:translate-x-2 transition-transform">{item}</span>
                  </div>
                ))}
              </div>

              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 p-4 md:p-6">
                <div className="relative z-10">
                  <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Our Testing Process</h3>
                  <div className="space-y-2 md:space-y-3">
                    {[
                      { phase: 'Initial Assessment', duration: '48h' },
                      { phase: 'Safety Validation', duration: '72h' },
                      { phase: 'Quality Control', duration: '24h' },
                      { phase: 'Final Certification', duration: '12h' }
                    ].map((step, index) => (
                      <div key={index} className="flex justify-between items-center text-xs md:text-sm">
                        <span className="text-gray-300">{step.phase}</span>
                        <span className="text-red-500 font-mono">{step.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5" />
              </div>
            </div>
          </div>
        </section>

        {/* Professional Testimonials */}
        <section className="py-12 md:py-20 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16">Trusted by Champions</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
              {[
                {
                  name: "Michael Rodriguez",
                  title: "MotoGP Champion 2022",
                  image: "/images/riders/man1.jpg",
                  quote: "I trust GearUp with my life on every race day. Their attention to safety and quality is unmatched."
                },
                {
                  name: "Sarah Thompson",
                  title: "Superbike Pro Rider",
                  image: "/images/riders/woman1.jpg",
                  quote: "After 15 years of professional racing, I've never found gear that matches the quality and reliability of GearUp's products."
                },
                {
                  name: "James Chen",
                  title: "Track Day Instructor",
                  image: "/images/riders/man2.jpg",
                  quote: "I recommend GearUp to all my students. Their commitment to safety education and proper gear fitting is exemplary."
                }
              ].map((testimonial) => (
                <div key={testimonial.name} className="bg-gray-800 p-4 md:p-6 rounded-lg">
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <div className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] relative">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm md:text-base">{testimonial.name}</h3>
                      <p className="text-gray-400 text-xs md:text-sm">{testimonial.title}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm md:text-base">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-gray-900 text-white py-10 md:py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Stay Ahead of the Pack</h2>
            <p className="mb-6 md:mb-8 text-sm md:text-base">Get exclusive access to new arrivals and rider-only offers</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white"
              />
              <button className="bg-red-600 px-6 py-3 rounded-md font-semibold hover:bg-red-700">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
