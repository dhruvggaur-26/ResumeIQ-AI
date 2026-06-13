import { FileText } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full z-50 border-b border-white/10 backdrop-blur-xl bg-black/20"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <FileText className="text-violet-500" size={30} />

          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
            ResumeIQ AI
          </h1>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex gap-8 text-slate-300">

          <a href="#features" className="hover:text-white transition">
            Features
          </a>

          <a href="#how" className="hover:text-white transition">
            How It Works
          </a>

          <a href="#contact" className="hover:text-white transition">
            Contact
          </a>

        </div>

        {/* CTA Button */}
        <button className="bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2 rounded-xl font-semibold hover:scale-105 transition duration-300">
          Get Started
        </button>

      </div>
    </motion.nav>
  );
};

export default Navbar;