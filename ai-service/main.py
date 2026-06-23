import os
import json
import time
from io import BytesIO
from html import escape

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from pypdf import PdfReader
from google import genai

from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet


# -------------------------
# Load Environment Variables
# -------------------------
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
client = genai.Client(api_key=GEMINI_API_KEY)


# -------------------------
# FastAPI App
# -------------------------
app = FastAPI()


# -------------------------
# CORS
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://resume-iq-ai-ecru.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------
# Skill Data
# -------------------------
SKILL_KEYWORDS = [
    "python", "java", "c++", "javascript", "react", "node",
    "fastapi", "django", "flask", "sql", "mongodb",
    "aws", "docker", "kubernetes", "git",
    "machine learning", "deep learning", "nlp"
]


ROLE_SKILLS = {
    "Frontend Developer": [
        "html", "css", "javascript", "react", "next", "tailwind"
    ],
    "Backend Developer": [
        "node", "express", "fastapi", "django", "flask", "sql", "mongodb"
    ],
    "Full Stack Developer": [
        "react", "node", "express", "mongodb", "sql", "javascript"
    ],
    "Machine Learning Engineer": [
        "python", "machine learning", "deep learning", "tensorflow", "pytorch", "nlp"
    ],
    "DevOps Engineer": [
        "docker", "kubernetes", "aws", "ci/cd", "linux"
    ]
}


# -------------------------
# Helper Functions
# -------------------------
async def extract_pdf_text_from_upload(file: UploadFile) -> str:
    pdf_bytes = await file.read()
    reader = PdfReader(BytesIO(pdf_bytes))

    text = ""

    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted + "\n"

    return text.strip()


def extract_json_from_text(raw_text: str):
    """
    Gemini sometimes returns JSON with code fences or small extra text.
    This function cleans it and extracts JSON safely.
    """
    if not raw_text:
        raise ValueError("Empty Gemini response")

    cleaned = raw_text.strip()
    cleaned = cleaned.replace("```json", "")
    cleaned = cleaned.replace("```", "")
    cleaned = cleaned.strip()

    try:
        return json.loads(cleaned)
    except Exception:
        start = cleaned.find("{")
        end = cleaned.rfind("}")

        if start == -1 or end == -1:
            raise ValueError("No JSON object found in Gemini response")

        json_part = cleaned[start:end + 1]
        return json.loads(json_part)


def generate_gemini_json(prompt: str, model_name: str = "gemini-2.5-flash"):
    response = client.models.generate_content(
        model=model_name,
        contents=prompt
    )

    raw_text = response.text if response.text else ""
    return extract_json_from_text(raw_text)


def generate_gemini_json_with_retry(prompts):
    """
    Tries smaller/lighter models first.
    If Gemini is overloaded, it retries instead of instantly falling back.
    """
    if isinstance(prompts, str):
        prompts = [prompts]

    models = [
        "gemini-2.5-flash-lite",
        "gemini-2.0-flash-lite",
        "gemini-2.0-flash",
        "gemini-2.5-flash",
    ]

    last_error = None

    for prompt in prompts:
        for model_name in models:
            for attempt in range(2):
                try:
                    response = client.models.generate_content(
                        model=model_name,
                        contents=prompt
                    )

                    raw_text = response.text if response.text else ""
                    return extract_json_from_text(raw_text)

                except Exception as error:
                    last_error = error
                    print(
                        f"Gemini error | model={model_name} | "
                        f"attempt={attempt + 1} | error={error}"
                    )
                    time.sleep(1)

    raise last_error


def calculate_rule_based_score(text: str):
    text_lower = text.lower()

    skill_matches = 0

    for skill in SKILL_KEYWORDS:
        if skill in text_lower:
            skill_matches += 1

    skill_score = min(40, (skill_matches / len(SKILL_KEYWORDS)) * 40)

    sections = ["experience", "education", "projects", "skills", "summary"]
    found_sections = sum(1 for section in sections if section in text_lower)

    structure_score = (found_sections / len(sections)) * 20

    exp_keywords = [
        "intern", "internship", "years",
        "developed", "built", "created"
    ]

    exp_score = sum(1 for word in exp_keywords if word in text_lower)
    exp_score = min(20, exp_score * 4)

    total_score = skill_score + structure_score + exp_score

    return round(total_score, 2)


def match_roles(text: str):
    text_lower = text.lower()

    results = {}

    for role, skills in ROLE_SKILLS.items():
        match_count = 0

        for skill in skills:
            if skill in text_lower:
                match_count += 1

        score = (match_count / len(skills)) * 100
        results[role] = round(score, 2)

    sorted_roles = dict(
        sorted(results.items(), key=lambda item: item[1], reverse=True)
    )

    return sorted_roles

def rule_based_jd_match(resume_text: str, job_description: str):
    resume_lower = resume_text.lower()
    jd_lower = job_description.lower()

    keywords = [
        "react", "next.js", "next", "javascript", "typescript",
        "html", "css", "redux", "redux toolkit", "context api",
        "hooks", "responsive", "mobile-first", "restful api",
        "graphql", "seo", "performance", "web vitals",
        "git", "testing", "debugging", "component-based",
        "ssr", "ssg"
    ]

    jd_keywords = []
    matching_skills = []
    missing_keywords = []

    for keyword in keywords:
        if keyword in jd_lower:
            jd_keywords.append(keyword)

            if keyword in resume_lower:
                matching_skills.append(keyword)
            else:
                missing_keywords.append(keyword)

    if len(jd_keywords) == 0:
        match_score = 0
    else:
        match_score = round((len(matching_skills) / len(jd_keywords)) * 100, 2)

    improvement_tips = []

    if missing_keywords:
        improvement_tips.append(
            "Add missing JD keywords naturally in your Skills, Projects, or Experience sections."
        )

    if "typescript" in missing_keywords:
        improvement_tips.append(
            "Add TypeScript experience if you have worked with typed JavaScript projects."
        )

    if "next.js" in missing_keywords or "next" in missing_keywords:
        improvement_tips.append(
            "Mention Next.js, SSR, or SSG experience if relevant to your projects."
        )

    if "redux" in missing_keywords or "redux toolkit" in missing_keywords:
        improvement_tips.append(
            "Add Redux or Redux Toolkit if you have used state management in React applications."
        )

    if "performance" in missing_keywords or "web vitals" in missing_keywords:
        improvement_tips.append(
            "Mention performance optimization, lazy loading, code splitting, or web vitals if applicable."
        )

    if not improvement_tips:
        improvement_tips.append(
            "Your resume matches several important JD keywords. Add measurable impact to strengthen it further."
        )

    return {
        "match_score": match_score,
        "matching_skills": matching_skills,
        "missing_keywords": missing_keywords,
        "improvement_tips": improvement_tips
    }


# -------------------------
# Health Check
# -------------------------
@app.get("/")
def home():
    return {
        "success": True,
        "message": "ResumeIQ AI Service is running"
    }


# -------------------------
# Environment Check
# -------------------------
@app.get("/check-env")
def check_env():
    key = os.getenv("GEMINI_API_KEY", "").strip()

    return {
        "key_exists": bool(key),
        "starts_with_AQ": key.startswith("AQ."),
        "starts_with_AIzaSy": key.startswith("AIzaSy"),
        "key_length": len(key)
    }


# -------------------------
# Test Gemini
# -------------------------
@app.get("/test-ai")
def test_ai():
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents="Say hello in one sentence."
        )

        return {
            "success": True,
            "response": response.text
        }

    except Exception as error:
        return {
            "success": False,
            "error": str(error)
        }


# -------------------------
# Extract PDF Text
# -------------------------
@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    try:
        text = await extract_pdf_text_from_upload(file)

        return {
            "success": True,
            "text": text
        }

    except Exception as error:
        return {
            "success": False,
            "error": str(error)
        }


# -------------------------
# Analyze Resume
# -------------------------
@app.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):
    try:
        text = await extract_pdf_text_from_upload(file)

        if not text:
            return {
                "success": False,
                "error": "Could not extract text from PDF"
            }

        rule_score = calculate_rule_based_score(text)

        prompt = f"""
You are an expert ATS Resume Analyzer.

Return ONLY valid JSON.

Format:
{{
  "strengths": [],
  "weaknesses": [],
  "missing_skills": [],
  "suggestions": []
}}

Rules:
- Keep every array item short and clear.
- Do not include markdown.
- Do not include extra text outside JSON.

Resume:
{text[:7000]}
"""

        try:
            ai_result = generate_gemini_json(prompt)

        except Exception as gemini_error:
            print("Analyze Resume Gemini Error:", gemini_error)

            ai_result = {
                "strengths": [
                    "Resume contains relevant technical skills and project experience.",
                    "Candidate shows practical exposure to modern development technologies."
                ],
                "weaknesses": [
                    "Resume can be improved with more measurable achievements.",
                    "Some bullet points can be made more ATS-friendly."
                ],
                "missing_skills": [
                    "Docker",
                    "AWS",
                    "CI/CD",
                    "Testing"
                ],
                "suggestions": [
                    "Add quantified achievements in project and internship bullet points.",
                    "Use stronger action verbs such as Developed, Implemented, Optimized, and Built.",
                    "Add more job-specific keywords based on the target job description.",
                    "Mention deployment, testing, and cloud tools if you have used them."
                ]
            }

        ai_score = 20
        final_score = min(100, rule_score + ai_score)

        role_matches = match_roles(text)

        return {
            "success": True,
            "ats_score": final_score,
            "rule_score": rule_score,
            "ai_score": ai_score,
            "recommended_roles": list(role_matches.keys())[:3],
            "role_match_scores": role_matches,
            "analysis": ai_result
        }

    except Exception as error:
        print("Analyze Resume Error:", error)

        return {
            "success": False,
            "error": str(error)
        }


# -------------------------
# Improve Resume
# -------------------------
@app.post("/improve-resume")
async def improve_resume(file: UploadFile = File(...)):
    try:
        text = await extract_pdf_text_from_upload(file)

        if not text:
            return {
                "overall_feedback": "Could not extract text from PDF.",
                "improved_bullets": [],
                "ats_improvements": [],
                "suggestions": [
                    "Please upload a text-based PDF resume instead of a scanned image PDF."
                ]
            }

        main_prompt = f"""
You are a professional resume coach and ATS optimizer.

Return ONLY valid JSON.

Format:
{{
  "overall_feedback": "string",
  "improved_bullets": [
    {{
      "original": "string",
      "improved": "string"
    }}
  ],
  "ats_improvements": [],
  "suggestions": []
}}

Rules:
- Give 5 to 7 improved bullet points.
- Improve project, internship, and experience bullets.
- Use strong action verbs.
- Make bullets ATS-friendly.
- Add measurable impact where possible.
- Keep output concise.
- No markdown.
- No extra text outside JSON.

Resume:
{text[:3500]}
"""

        compact_prompt = f"""
Return ONLY valid JSON.

Format:
{{
  "overall_feedback": "string",
  "improved_bullets": [
    {{
      "original": "string",
      "improved": "string"
    }}
  ],
  "ats_improvements": [],
  "suggestions": []
}}

Task:
Improve this resume for ATS and recruiters.

Rules:
- Give 3 to 5 improved bullet points.
- Keep output short.
- No markdown.
- No extra text outside JSON.

Resume:
{text[:1800]}
"""

        try:
            return generate_gemini_json_with_retry([main_prompt, compact_prompt])

        except Exception as gemini_error:
            print("Improve Resume Gemini Error:", gemini_error)

            return {
                "overall_feedback": (
                    "Gemini is temporarily busy, so ResumeIQ generated fallback "
                    "improvement guidance based on ATS best practices."
                ),
                "improved_bullets": [
                    {
                        "original": "Built projects using web technologies.",
                        "improved": "Developed full-stack web applications using React, FastAPI, and AI APIs to deliver resume analysis, ATS scoring, and job-matching features."
                    },
                    {
                        "original": "Worked on resume analysis project.",
                        "improved": "Implemented an AI-powered resume analysis workflow that extracts PDF text, calculates ATS scores, detects missing skills, and generates personalized improvement suggestions."
                    },
                    {
                        "original": "Created frontend pages.",
                        "improved": "Designed responsive React interfaces with Tailwind CSS to provide a smooth resume upload, analysis, and reporting experience."
                    },
                    {
                        "original": "Used AI in project.",
                        "improved": "Integrated Gemini AI with FastAPI to generate resume feedback, missing skill analysis, and job description matching insights."
                    }
                ],
                "ats_improvements": [
                    "Add measurable results such as percentages, counts, or performance improvements.",
                    "Use job-specific keywords from the target job description.",
                    "Mention deployment, testing, cloud, and database tools where relevant.",
                    "Keep section headings ATS-friendly such as Skills, Projects, Experience, and Education."
                ],
                "suggestions": [
                    "Start bullet points with strong action verbs like Built, Developed, Implemented, Optimized, or Designed.",
                    "Avoid vague lines and show clear impact.",
                    "Add technical keywords naturally inside project and experience descriptions.",
                    "Keep formatting simple and consistent for ATS readability."
                ]
            }

    except Exception as error:
        print("Improve Resume Error:", error)

        return {
            "overall_feedback": "Something went wrong while improving the resume.",
            "improved_bullets": [],
            "ats_improvements": [],
            "suggestions": [
                str(error)
            ]
        }


# -------------------------
# Generate PDF Report
# -------------------------
@app.post("/generate-report")
async def generate_report(data: dict):
    try:
        buffer = BytesIO()

        doc = SimpleDocTemplate(buffer)
        styles = getSampleStyleSheet()

        content = []

        content.append(Paragraph("ResumeIQ AI Report", styles["Title"]))
        content.append(Spacer(1, 12))

        content.append(
            Paragraph(
                f"ATS Score: {escape(str(data.get('ats_score', 0)))}%",
                styles["Heading2"]
            )
        )

        content.append(Spacer(1, 12))

        content.append(
            Paragraph(
                f"Best Role Match: {escape(str(data.get('best_role', '')))}",
                styles["Normal"]
            )
        )

        content.append(Spacer(1, 12))

        for section in [
            "strengths",
            "weaknesses",
            "missing_skills",
            "suggestions"
        ]:
            content.append(
                Paragraph(section.replace("_", " ").title(), styles["Heading2"])
            )

            for item in data.get(section, []):
                content.append(
                    Paragraph(f"• {escape(str(item))}", styles["Normal"])
                )

            content.append(Spacer(1, 10))

        doc.build(content)

        buffer.seek(0)

        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=ResumeIQ_Report.pdf"
            }
        )

    except Exception as error:
        print("Generate Report Error:", error)

        return {
            "success": False,
            "error": str(error)
        }


# -------------------------
# Match Job Description
# -------------------------
@app.post("/match-job-description")
async def match_job_description(
    file: UploadFile = File(...),
    job_description: str = Form("")
):
    try:
        resume_text = await extract_pdf_text_from_upload(file)

        if not resume_text:
            return {
                "success": False,
                "error": "Could not extract text from PDF"
            }

        prompt = f"""
You are an ATS job description matching expert.

Compare the resume with the job description.

Return ONLY valid JSON.

Format:
{{
  "match_score": 0,
  "matching_skills": [],
  "missing_keywords": [],
  "improvement_tips": []
}}

Rules:
- match_score should be between 0 and 100.
- Do not include markdown.
- Do not include extra text outside JSON.

Resume:
{resume_text[:6000]}

Job Description:
{job_description[:3000]}
"""

        try:
            return generate_gemini_json_with_retry(prompt)

        except Exception as gemini_error:
            print("JD Match Gemini Error:", gemini_error)

            return rule_based_jd_match(resume_text, job_description)
            

    except Exception as error:
        print("JD Match Error:", error)

        return {
            "success": False,
            "error": str(error)
        }