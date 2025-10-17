import logo from '../../assets/images/robotum-logo-blue-white.svg'
import * as assets from '../../assets'

export default function FooterSection() {
  return (
    <footer className="bg-[#000C21] text-white px-6 pt-16 pb-10 font-exo">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Logo and Description */}
        <div className="flex flex-col gap-4">
          <img src={logo} alt="RoboTUM Logo" className="h-10" />
          <p className="text-gray-400 text-sm">
            RoboTUM is a student-driven robotics club exploring AI, design, and engineering to push the limits of autonomous systems.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Explore</h3>
          <ul className="flex flex-col gap-2 text-sm text-gray-300">
            <li><a href="#" className="hover:text-white">Homepage</a></li>
            <li><a href="#" className="hover:text-white">Projects</a></li>
            <li><a href="#" className="hover:text-white">Events</a></li>
            <li><a href="#" className="hover:text-white">About us</a></li>
            <li><a href="#" className="hover:text-white">Join us</a></li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Legal</h3>
          <ul className="flex flex-col gap-2 text-sm text-gray-300">
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Legal Notice</a></li>
            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Follow us</h3>
          <div className="flex gap-4 mt-2 bg-[#001833] p-4 rounded-md">
            <a href="#" className="hover:opacity-80">
              <img src={assets.instagramIcon} alt="Instagram" className="h-6 w-6" />
            </a>
            <a href="#" className="hover:opacity-80">
              <img src={assets.linkedinIcon} alt="LinkedIn" className="h-6 w-6" />
            </a>
            <a href="mailto:example@robotum.com" className="hover:opacity-80">
              <img src={assets.emailIcon} alt="Email" className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-8 border-gray-700" />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between text-sm text-gray-500">
        <span>© 2025 RoboTUM. All rights reserved.</span>
        <span>Built with ❤️ by RoboTUM Team</span>
      </div>
    </footer>
  )
}