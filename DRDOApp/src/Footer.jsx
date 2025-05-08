import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#05659e] text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Organization Info */}
        <div>
          <h2 className="text-2xl font-bold mb-2">DRDO CFEES</h2>
          <p className="text-sm opacity-80">
            Centre for Excellence in Education & Services — empowering
            research & innovation.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:underline hover:text-yellow-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/labs" className="hover:underline hover:text-yellow-300">
                Labs & Groups
              </Link>
            </li>
            <li>
              <Link to="/employees" className="hover:underline hover:text-yellow-300">
                Employees
              </Link>
            </li>
            <li>
              <Link to="/publications" className="hover:underline hover:text-yellow-300">
                Publications
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Connect With Us</h3>
          <div className="flex space-x-4">
            <a
              href="https://www.facebook.com/DRDO"
              className="hover:text-yellow-300 transition"
            >
              <FaFacebook size={22} />
            </a>
            <a
              href="https://twitter.com/DRDO_India"
              className="hover:text-yellow-300 transition"
            >
              <FaTwitter size={22} />
            </a>
            <a
              href="https://www.linkedin.com/company/drdo-india"
              className="hover:text-yellow-300 transition"
            >
              <FaLinkedin size={22} />
            </a>
            <a
              href="https://www.instagram.com/drdo_india"
              className="hover:text-yellow-300 transition"
            >
              <FaInstagram size={22} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 text-center py-4 text-sm text-white/80">
        © {new Date().getFullYear()} DRDO CFEES. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
