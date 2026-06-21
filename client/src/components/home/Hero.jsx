import { motion } from "framer-motion";
import Container from "../common/Container";
import PrimaryButton from "../common/PrimaryButton";
import { useNavigate } from "react-router-dom";
const Hero = () => {
    const navigate = useNavigate();
  return (
  
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Animated Gradient Blobs */}
      <motion.div
        className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-purple-600/20 blur-[120px]"
        animate={{
          x: [0, 40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full bg-cyan-500/20 blur-[120px]"
        animate={{
          x: [0, -30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Particles */}
      {[
        { top: "20%", left: "10%" },
        { top: "30%", left: "80%" },
        { top: "60%", left: "15%" },
        { top: "70%", left: "70%" },
        { top: "45%", left: "50%" },
      ].map((item, index) => (
        <motion.div
          key={index}
          className="absolute w-2 h-2 rounded-full bg-white/30"
          style={{
            top: item.top,
            left: item.left,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 3 + index,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: -70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm mb-6">
            ✨ Trusted by 10,000+ Aspiring Developers
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
            Land Your Dream Job
            <span className="block bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
              with AI-Powered Resume Analysis
            </span>
          </h1>

          <p className="text-slate-300 mt-8 text-lg leading-8 max-w-xl">
            Upload your resume and instantly receive an ATS score,
            personalized AI feedback, missing skills analysis, and job
            recommendations tailored to your profile.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            

            <PrimaryButton onClick={()=>navigate("/upload")}>
              Upload Resume
            </PrimaryButton>

            <button className="border border-slate-700 px-7 py-3 rounded-xl hover:bg-slate-800 transition duration-300">
              See AI in Action
            </button>
          </div>

          <div className="flex items-center gap-3 mt-8 text-slate-400 text-sm">
            <span className="text-yellow-400">★★★★★</span>
            <span>Rated 4.9/5 by aspiring software engineers</span>
          </div>
        </motion.div>

        {/* RIGHT SIDE */}
        <div className="relative">
          {/* Glow Behind Card */}
          <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full"></div>

          {/* Dashboard Card */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, x: 70 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.03 }}
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Resume.pdf</h2>

                <span className="text-blue-400 font-bold">
                  ATS 92%
                </span>
              </div>

              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full w-[92%] bg-gradient-to-r from-violet-500 to-blue-500 rounded-full"></div>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold text-slate-300 mb-3">
                  Skills Detected
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/60 p-3 rounded-xl">
                    ✅ React
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-xl">
                    ✅ Node.js
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-xl">
                    ✅ MongoDB
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-xl text-yellow-400">
                    ⚠ Docker
                  </div>
                </div>

                <div className="mt-8 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <p className="text-sm text-slate-300">
                    💡 AI Insight
                  </p>

                  <p className="mt-2 text-white">
                    Adding Docker and AWS could improve your ATS
                    score by
                    <span className="text-violet-400 font-semibold">
                      {" "}
                      6%.
                    </span>
                  </p>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <span className="text-slate-400">
                    Best Job Match
                  </span>

                  <span className="font-bold text-blue-400">
                    Frontend Developer • 89%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;