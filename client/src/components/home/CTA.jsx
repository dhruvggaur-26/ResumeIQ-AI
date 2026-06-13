import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="py-28 px-6">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl border border-violet-500/20 bg-white/5 backdrop-blur-xl p-12 md:p-16 text-center"
      >
        {/* Background Glow */}
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-blue-600/20 blur-[120px]" />

        {/* Content */}
        <div className="relative z-10">
          <span className="inline-block px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm">
            🚀 Get Started Today
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">
            Ready to Land Your
            <span className="block bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Dream Job?
            </span>
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-slate-400 text-lg leading-8">
            Upload your resume and receive an AI-powered ATS score,
            personalized improvement suggestions, and smart job
            recommendations in just a few seconds.
          </p>

          <button className="mt-10 bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-4 rounded-xl font-semibold shadow-lg shadow-violet-600/30 hover:scale-105 transition duration-300">
            Upload Resume
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;