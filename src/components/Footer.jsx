import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => (
  <footer className="bg-ink text-white mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid gap-10 md:grid-cols-4">
      <div>
        <Logo wordmarkClassName="text-white" />
        <p className="mt-4 text-sm text-white/60 leading-relaxed">
          Trusted healthcare products and appointment booking, delivered with care.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white/90 mb-4">Quick Links</h3>
        <ul className="space-y-2.5 text-sm text-white/60">
          <li><Link to="/products" className="hover:text-white">Shop Products</Link></li>
          <li><Link to="/appointment" className="hover:text-white">Book an Appointment</Link></li>
          <li><Link to="/track-order" className="hover:text-white">Track Your Order</Link></li>
          <li><Link to="/about" className="hover:text-white">About Us</Link></li>
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white/90 mb-4">Contact</h3>
        <ul className="space-y-2.5 text-sm text-white/60">
          <li>
            <a href="tel:1234567890" className="hover:text-white">+91 12345 67890</a>
          </li>
          <li>
            <a href="mailto:anan@gmail.com" className="hover:text-white">anan@gmail.com</a>
          </li>
          <li>Mon – Sat, 9:00 AM – 8:00 PM</li>
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white/90 mb-4">Find Us</h3>
        <div className="rounded-lg overflow-hidden border border-white/10 h-32 bg-white/5 flex items-center justify-center text-white/40 text-xs">
          Map placeholder — embed Google Maps here
        </div>
      </div>
    </div>

    <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
      © {new Date().getFullYear()} ANAN Clinic. All rights reserved.
    </div>
  </footer>
);

export default Footer;
