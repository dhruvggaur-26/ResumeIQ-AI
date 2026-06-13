import { motion } from "framer-motion";
import {
  FileText,
  Target,
  Briefcase,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "AI Resume Parsing",
    description:
      "Extract skills, education, projects, and experience automatically from your resume.",
  },
  {
    icon: Target,
    title: "ATS Score Analysis",
    description:
      "Understand how recruiter-friendly your resume is with an AI-powered ATS score.",
  },
  {
    icon: Briefcase,
    title: "Smart Job Matching",
    description:
      "Get personalized job recommendations based on your resume and skill set.",
  },
  {
    icon: Sparkles,
    title: "AI Suggestions",
    description:
      "Receive actionable recommendations to improve your resume and increase interview chances.",
  },
];

const Features = () => {
  return (
    <section className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm">
            🚀 Powerful Features
          </span>

          <h2 className="text-4xl md:text-5xl font-bold mt-6">
            Everything You Need to Build
            <span className="block bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              a Recruiter-Ready Resume
            </span>
          </h2>

          <p className="text-slate-400 mt-6 max-w-2xl mx-auto text-lg">
            ResumeIQ AI combines ATS analysis, AI insights, and intelligent
            job matching into one seamless platform.
          </p>
        </motion.div>

        {/* Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                }}
                whileHover={{
                  y: -10,
                  scale: 1.03,
                }}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-violet-500/40 transition-all duration-300"
              >
                {/* Icon */}

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 flex items-center justify-center mb-6 group-hover:rotate-6 transition">
                  <Icon size={30} />
                </div>

                <h3 className="text-2xl font-semibold mb-4">
                  {feature.title}
                </h3>

                <p className="text-slate-400 leading-7">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;