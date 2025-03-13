export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 dark:text-white">GearUp Moto</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your ultimate destination for premium motorcycle gear and accessories.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/helmets" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Helmets</a></li>
              <li><a href="/protection" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Protection Gear</a></li>
              <li><a href="/accessories" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Accessories</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Contact Us</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Email: info@gearup.com<br />
              Phone: (555) 123-4567
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
