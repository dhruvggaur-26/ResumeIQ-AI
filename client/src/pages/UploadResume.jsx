import Navbar from "../components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const UploadResume = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 pt-32">
        <h1 className="text-4xl md:text-5xl font-bold text-center">
          Upload Your Resume
        </h1>

        <p className="text-slate-400 text-center mt-4">
          Upload your resume PDF and let AI analyze your ATS score, skills, and improvements.
        </p>

        <div className="mt-12 border-2 border-dashed border-violet-500/40 rounded-3xl p-12 text-center bg-white/5">
          <div className="text-5xl mb-4">📄</div>

          <h2 className="text-2xl font-semibold">
            Drop your resume here
          </h2>

          <p className="text-slate-400 mt-2">
            PDF files only
          </p>

          <input
            type="file"
            accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}

            className="mt-8 block mx-auto text-sm text-slate-300"
          />

         <button
  onClick={async () => {
    if (!file) {
      alert("Please upload a resume first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await fetch(
        "https://resumeiq-ai-backend.onrender.com",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log("Analysis Result:", data);

      navigate("/result", {
  state: {
    result: data,
    file: file,
  },
});
    } catch (error) {
      console.error(error);
      alert("Failed to analyze resume");
    } finally {
      setLoading(false);
    }
  }}
  className="mt-8 px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 font-semibold hover:scale-105 transition"
>
  {loading ? "Analyzing..." : "Analyze Resume"}
</button>
        </div>
      </div>
    </div>
  );
};

export default UploadResume;