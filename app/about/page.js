import Navbar from "@/components/Navbar";

export default function About() {
  return (
    <>
      <Navbar/>
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">About GearUp Moto</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Founded in 2023, GearUp Moto is your premier destination for high-quality motorcycle gear and accessories. 
              We're passionate about providing riders with the best equipment to enhance their riding experience while 
              ensuring maximum safety on the road.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Our Mission</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              To provide motorcyclists with premium quality gear at competitive prices, backed by exceptional customer 
              service and expert knowledge. We believe that every rider deserves access to the best safety equipment 
              and accessories available.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Why Choose Us?</h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
              <li>Extensive selection of premium motorcycle gear</li>
              <li>Expert staff with real riding experience</li>
              <li>Competitive pricing and regular promotions</li>
              <li>Fast shipping and hassle-free returns</li>
              <li>Dedicated customer support</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Our Commitment</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              We're committed to the motorcycle community and continuously strive to bring you the latest innovations 
              in motorcycle gear and accessories. Your safety and satisfaction are our top priorities.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
