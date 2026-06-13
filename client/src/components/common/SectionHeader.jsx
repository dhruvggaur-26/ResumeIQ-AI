import { motion } from "framer-motion";

const SectionHeader = ({
  badge,
  title,
  gradientText,
  description,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="text-center mb-16"
    >
      {badge && (
        <span className="px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm">
          {badge}
        </span>
      )}

      <h2 className="text-4xl md:text-5xl font-bold mt-6">
        {title}

        {gradientText && (
          <span className="block bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            {gradientText}
          </span>
        )}
      </h2>

      {description && (
        <p className="text-slate-400 mt-6 max-w-2xl mx-auto text-lg">
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeader;