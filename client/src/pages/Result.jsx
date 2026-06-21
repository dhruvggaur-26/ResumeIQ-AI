import Navbar from "../components/layout/Navbar";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const Result = () => {
  const location = useLocation();

  const result = location.state?.result || location.state;
  const file = location.state?.file;
  const analysis = result?.analysis || {};
  if (!result) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">No Analysis Found</h1>
        <p className="text-slate-400 mt-3">
          Please upload a resume first.
        </p>
      </div>
    </div>
  );
}

  const [improveLoading, setImproveLoading] = useState(false);
  const [improveData, setImproveData] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
const [jdResult, setJdResult] = useState(null);
const [jdLoading, setJdLoading] = useState(false);

const handleJobMatch = async () => {
  if (!file) {
    alert("Resume file not found");
    return;
  }

  if (!jobDescription.trim()) {
    alert("Please paste a job description");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("job_description", jobDescription);

  try {
    setJdLoading(true);

    const response = await fetch(
      "http://127.0.0.1:8000/match-job-description",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    console.log("JD Match:", data);

    setJdResult(data);
  } catch (error) {
    console.error(error);
    alert("Failed to match job description");
  } finally {
    setJdLoading(false);
  }
};





  const handleImproveResume = async () => {
    if (!file) {
      alert("Resume file not found. Please upload again.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setImproveLoading(true);

      const response = await fetch("http://127.0.0.1:8000/improve-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Improve Result:", data);

      setImproveData(data);
    } catch (error) {
      console.error(error);
      alert("Failed to improve resume");
    } finally {
      setImproveLoading(false);
    }
  };

  const handleDownloadReport = async () => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/generate-report",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ats_score: result?.ats_score,
          best_role: result?.recommended_roles?.[0],
          strengths: analysis?.strengths,
          weaknesses: analysis?.weaknesses,
          missing_skills: analysis?.missing_skills,
          suggestions: analysis?.suggestions,
        }),
      }
    );

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "ResumeIQ_Report.pdf";
    a.click();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    alert("Failed to download report");
  }
};

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-4xl font-bold text-center">
          Resume Analysis Report
        </h1>
        <p className="text-slate-400 text-center mt-4">
  AI-powered resume insights, ATS optimization, job-role matching, and improvement recommendations.
</p>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 p-6 rounded-2xl">
            <h2 className="text-xl font-semibold">ATS Score</h2>
            <div className="mt-4 flex justify-center">
  <span
    className={`px-4 py-2 rounded-full font-semibold ${
      result?.ats_score >= 85
        ? "bg-green-600"
        : result?.ats_score >= 70
        ? "bg-yellow-600"
        : "bg-red-600"
    }`}
  >

    {result?.ats_score >= 85
      ? "Excellent"
      : result?.ats_score >= 70
      ? "Good"
      : "Needs Improvement"}
  </span>
</div>
 <p className="text-center text-slate-400 mt-3">
    Based on skills, experience, resume structure, and AI evaluation.
  </p>

            <div className="mt-6 flex justify-center">
              <div className="relative w-40 h-40 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-slate-950 flex items-center justify-center">
                  <span className="text-4xl font-bold text-violet-400">
                    {Math.round(result?.ats_score || 0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl">
            <h2 className="text-xl font-semibold">Best Job Match</h2>

            <p className="text-2xl text-blue-400 mt-4">
              {result?.recommended_roles?.[0] || "No role found"}
            </p>

            <button
              onClick={handleImproveResume}
              className="mt-8 px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 font-semibold hover:scale-105 transition"
            >
              {improveLoading ? "Improving..." : "✨ Improve Resume"}
            </button>

            <button
  onClick={handleDownloadReport}
  className="mt-4 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold hover:scale-105 transition"
>
  📄 Download PDF Report
</button>
          </div>
        </div>

        <div className="mt-8 bg-white/5 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-6">Job Match Scores</h2>

          <div className="space-y-4">
            {Object.entries(result?.role_match_scores || {}).map(
              ([role, score]) => (
                <div key={role}>
                  <div className="flex justify-between mb-2">
                    <span>{role}</span>
                    <span className="font-semibold">{score}%</span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="mt-8 bg-white/5 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4">Recommended Roles</h2>

          <div className="flex flex-wrap gap-3">
            {result?.recommended_roles?.map((role, index) => (
              <span key={index} className="bg-violet-600 px-4 py-2 rounded-lg">
                {role}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-white/5 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4">Missing Skills</h2>

          <div className="flex flex-wrap gap-3">
            {analysis.missing_skills?.map((skill, index) => (
              <span key={index} className="bg-yellow-600 px-4 py-2 rounded-lg">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-white/5 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4">Strengths</h2>

          <ul className="space-y-3 text-slate-300">
            {analysis.strengths?.map((item, index) => (
              <li key={index}>✅ {item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-8 bg-white/5 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4">Weaknesses</h2>

          <ul className="space-y-3 text-slate-300">
            {analysis.weaknesses?.map((item, index) => (
              <li key={index}>⚠️ {item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-8 bg-white/5 p-6 rounded-2xl">
            <div className="mt-8 bg-white/5 p-6 rounded-2xl">
  <h2 className="text-xl font-semibold mb-4">
    Job Description Match
  </h2>

  <textarea
    value={jobDescription}
    onChange={(e) => setJobDescription(e.target.value)}
    placeholder="Paste Job Description Here..."
    className="w-full h-40 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white"
  />

  <button
    onClick={handleJobMatch}
    className="mt-4 px-8 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 font-semibold hover:scale-105 transition"
  >
    {jdLoading ? "Matching..." : "🎯 Match Job Description"}
  </button>
</div>
{jdResult && (
  <div className="mt-8 bg-white/5 p-6 rounded-2xl">
    <h2 className="text-xl font-semibold mb-4">
      JD Match Results
    </h2>

    <p className="text-3xl font-bold text-green-400 mb-6">
      Match Score: {jdResult.match_score}%
    </p>

    <h3 className="font-semibold mb-2">
      Matching Skills
    </h3>

    <ul className="mb-6">
      {jdResult.matching_skills?.map((skill, index) => (
        <li key={index}>✅ {skill}</li>
      ))}
    </ul>

    <h3 className="font-semibold mb-2">
      Missing Keywords
    </h3>

    <ul className="mb-6">
      {jdResult.missing_keywords?.map((skill, index) => (
        <li key={index}>❌ {skill}</li>
      ))}
    </ul>

    <h3 className="font-semibold mb-2">
      Improvement Tips
    </h3>

    <ul>
      {jdResult.improvement_tips?.map((tip, index) => (
        <li key={index}>💡 {tip}</li>
      ))}
    </ul>
  </div>
)}
            


          <h2 className="text-xl font-semibold mb-4">AI Suggestions</h2>

          <ul className="space-y-3 text-slate-300">
            {analysis.suggestions?.map((item, index) => (
              <li key={index}>✅ {item}</li>
            ))}
          </ul>
        </div>

        {improveData && (
          <div className="mt-8 bg-white/5 p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">
              Improved Resume Feedback
            </h2>

            <p className="text-slate-300 mb-6">
              {improveData.overall_feedback}
            </p>

            <h3 className="text-lg font-semibold mb-3">
              ATS Improvements
            </h3>

            <ul className="space-y-3 text-slate-300">
              {improveData.ats_improvements?.map((item, index) => (
                <li key={index}>✅ {item}</li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">
              Improved Bullets
            </h3>

            <div className="space-y-4">
              {improveData.improved_bullets?.map((item, index) => (
                <div key={index} className="bg-slate-900/70 p-4 rounded-xl">
                  <p className="text-red-300">
                    <strong>Original:</strong> {item.original}
                  </p>

                  <p className="text-green-300 mt-2">
                    <strong>Improved:</strong> {item.improved}
                  </p>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-3">
              Extra Suggestions
            </h3>

            <ul className="space-y-3 text-slate-300">
              {improveData.suggestions?.map((item, index) => (
                <li key={index}>💡 {item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;