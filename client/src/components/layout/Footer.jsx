// import { Linkedin, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          {/* Logo */}

          <div className="flex items-center gap-2">
            <Sparkles className="text-violet-400" size={28} />

            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              ResumeIQ AI
            </h2>
          </div>

          {/* Tagline */}

          <p className="mt-4 max-w-xl text-slate-400 leading-7">
            AI-powered resume analysis, ATS optimization, and smart
            job matching to help you stand out and get hired faster.
          </p>

          {/* Links */}

          <div className="flex flex-wrap justify-center gap-8 mt-8 text-slate-300">
            <a href="#" className="hover:text-violet-400 transition">
              Home
            </a>

            <a href="#" className="hover:text-violet-400 transition">
              Features
            </a>

            <a href="#" className="hover:text-violet-400 transition">
              Dashboard
            </a>

            <a href="#" className="hover:text-violet-400 transition">
              Contact
            </a>
          </div>

          {/* Socials */}

          <div className="flex gap-6 mt-8">
  <a
    href="https://github.com/dhruvggaur-26"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-violet-400 transition"
  >
    <FaGithub size={22} />
  </a>

  <a
    href="https://www.linkedin.com/in/dhruv-gaur-212264412/?skipRedirect=true"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-violet-400 transition"
  >
    <FaLinkedin size={22} />
  </a>
</div>

          {/* Copyright */}

          <p className="mt-10 text-sm text-slate-500">
            © 2026 ResumeIQ AI. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;