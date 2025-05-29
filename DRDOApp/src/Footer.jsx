import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#05659e] text-white mt-16">
      <div className="mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Organization Info */}
        <div>
          <h2 className="text-3xl font-extrabold mb-4">Centre for Fire, Explosive and Environment Safety (CFEES)</h2>
          <p className="text-base opacity-90 leading-relaxed">
            Centre for Excellence in Education & Services — empowering research
            & innovation.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-2xl font-semibold mb-5 border-b border-yellow-300 pb-2">
            Quick Links
          </h3>
          <ul className="space-y-3 text-lg">
            <li>
              <Link
                to="/"
                className="hover:underline hover:text-yellow-300 transition"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/labs"
                className="hover:underline hover:text-yellow-300 transition"
              >
                Labs & Groups
              </Link>
            </li>
            <li>
              <Link
                to="/employees"
                className="hover:underline hover:text-yellow-300 transition"
              >
                Employees
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="hover:underline hover:text-yellow-300 transition"
              >
                Publications
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-2xl font-semibold mb-5 border-b border-yellow-300 pb-2">
            Contact Us
          </h3>
          <p className="text-base opacity-90 mb-2">Center for Fire, Explosive & Environment Safety Defence Research & Development Organisatio, Brig. S.K. Mazumdar Marg, Timarpur, Delhi-110054</p>
          {/* <p className="text-base opacity-90 mb-2">New Delhi, India</p> */}
          <p className="text-base opacity-90 mb-2">
            Email: director@cfees.deldom
          </p>
          <p className="text-base opacity-90">Phone: 011-23813239</p>
        </div>
      </div>

      <div className="border-t border-white/30 text-center py-5 text-sm text-white/80">
        © {new Date().getFullYear()} ABC Company. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
