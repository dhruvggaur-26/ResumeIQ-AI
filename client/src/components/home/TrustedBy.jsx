import { motion } from "framer-motion";

const technologies = [
  "React",
  "Node.js",
  "MongoDB",
  "FastAPI",
  "Python",
  "OpenAI",
  "Tailwind CSS",
  "Framer Motion",
];

const TrustedBy = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-violet-400 uppercase tracking-[0.3em] text-sm font-semibold">
            Powered By
          </p>

          <h2 className="text-3xl md:text-4xl font-bold mt-4">
            Modern Technologies Behind ResumeIQ AI
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.05,
              }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center font-semibold text-slate-200 hover:border-violet-500/40 transition-all"
            >
              {tech}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;