import logo from '../../assets/images/robotum-logo-blue-white.svg'
import instagramIcon from '../../assets/icons/instagram.png'
import linkedinIcon from '../../assets/icons/linkedin.png'
import emailIcon from '../../assets/icons/advertising.png'

export default function FooterSection() {
  return (
    <footer className="bg-[#000C21] text-white px-6 py-12 font-exo">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo */}
        <div>
          <img src={logo} alt="RoboTUM Logo" className="h-10 mb-4" />
        </div>

        {/* Student Club Links */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg mb-2">Student club</h3>
          <a href="#" className="text-gray-300 hover:text-white">Homepage</a>
          <a href="#" className="text-gray-300 hover:text-white">Projects</a>
          <a href="#" className="text-gray-300 hover:text-white">Events</a>
          <a href="#" className="text-gray-300 hover:text-white">About us</a>
          <a href="#" className="text-gray-300 hover:text-white">Join us</a>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Follow us</h3>
          <div className="flex gap-4 text-xl">
            <a href="#" className="hover:opacity-80">
              <img src={instagramIcon} alt="Instagram" className="h-6 w-6" />
            </a>
            <a href="#" className="hover:opacity-80">
              <img src={linkedinIcon} alt="LinkedIn" className="h-6 w-6" />
            </a>
            <a href="mailto:example@robotum.com" className="hover:opacity-80">
              <img src={emailIcon} alt="Email" className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-8 border-gray-600" />

      {/* Bottom Row */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between text-sm text-gray-400">
        <span>© 2025 RoboTUM. All rights reserved.</span>
        <div className="flex gap-6 mt-2 md:mt-0">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Legal Notice</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}