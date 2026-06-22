import os
import json
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File
from dotenv import load_dotenv
from pypdf import PdfReader
import google.generativeai as genai
from fastapi.responses import StreamingResponse
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet




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


# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "https://YOUR-VERCEL-URL.vercel.app"
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



def calculate_rule_based_score(text: str):
    text_lower = text.lower()

    # -------------------
    # 1. Skill Score (40)
    # -------------------
    skill_matches = 0
    for skill in SKILL_KEYWORDS:
        if skill in text_lower:
            skill_matches += 1

    skill_score = min(40, (skill_matches / len(SKILL_KEYWORDS)) * 40)

    # -------------------
    # 2. Structure Score (20)
    # -------------------
    sections = ["experience", "education", "projects", "skills", "summary"]
    found_sections = sum(1 for s in sections if s in text_lower)

    structure_score = (found_sections / len(sections)) * 20

    # -------------------
    # 3. Experience Score (20)
    # -------------------
    exp_keywords = ["intern", "internship", "years", "developed", "built", "created"]
    exp_score = sum(1 for w in exp_keywords if w in text_lower)
    exp_score = min(20, exp_score * 4)

    # -------------------
    # FINAL RULE SCORE (out of 100)
    # -------------------
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

    # sort roles by best match
    sorted_roles = dict(sorted(results.items(), key=lambda x: x[1], reverse=True))

    return sorted_roles


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
# Test Gemini
# -------------------------
@app.get("/test-ai")
def test_ai():
    response = model.generate_content("Say hello in one sentence.")
    return {
        "response": response.text
    }


# -------------------------
# Extract PDF Text
# -------------------------
@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    pdf_bytes = await file.read()

    reader = PdfReader(BytesIO(pdf_bytes))

    text = ""
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted + "\n"

    return {
        "text": text
    }


# -------------------------
# Analyze Resume (ATS AI)
# -------------------------
@app.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):
    pdf_bytes = await file.read()

    reader = PdfReader(BytesIO(pdf_bytes))

    text = ""
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted + "\n"

    # -------------------------
    # 1. RULE-BASED SCORE
    # -------------------------
    rule_score = calculate_rule_based_score(text)

    # -------------------------
    # 2. AI ANALYSIS (GEMINI)
    # -------------------------
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

Resume:
{text}
"""

    response = model.generate_content(prompt)

    raw_text = response.text.strip()
    cleaned = raw_text.replace("```json", "").replace("```", "").strip()

    try:
        ai_result = json.loads(cleaned)
    except Exception:
        ai_result = {
            "strengths": [],
            "weaknesses": [],
            "missing_skills": [],
            "suggestions": []
        }

    # -------------------------
    # 3. FINAL HYBRID SCORE
    # -------------------------
    ai_score = 20
    final_score = min(100, rule_score + ai_score)

    # -------------------------
    # 4. ROLE MATCHING
    # -------------------------
    role_matches = match_roles(text)

    # -------------------------
    # 5. RESPONSE
    # -------------------------
    return {
        "ats_score": final_score,
        "rule_score": rule_score,
        "ai_score": ai_score,
        "recommended_roles": list(role_matches.keys())[:3],
        "role_match_scores": role_matches,
        "analysis": ai_result
    }
@app.post("/improve-resume")
async def improve_resume(file: UploadFile = File(...)):
    pdf_bytes = await file.read()

    reader = PdfReader(BytesIO(pdf_bytes))

    text = ""
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted + "\n"

    prompt = f"""
You are a professional resume coach and ATS optimizer.

Improve the following resume.

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
- Make bullets more impactful
- Add measurable impact where possible
- Keep it professional and concise

Resume:
{text}
"""

    response = model.generate_content(prompt)

    raw_text = response.text.strip()
    cleaned = raw_text.replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(cleaned)

    except Exception:
        return {
            "overall_feedback": "Could not parse AI response",
            "improved_bullets": [],
            "ats_improvements": [],
            "suggestions": [],
            "raw_output": raw_text
        }
    
@app.post("/generate-report")
async def generate_report(data: dict):

    buffer = BytesIO()

    doc = SimpleDocTemplate(buffer)
    styles = getSampleStyleSheet()

    content = []

    content.append(Paragraph("ResumeIQ AI Report", styles["Title"]))
    content.append(Spacer(1, 12))

    content.append(
        Paragraph(
            f"ATS Score: {data.get('ats_score', 0)}%",
            styles["Heading2"]
        )
    )

    content.append(Spacer(1, 12))

    content.append(
        Paragraph(
            f"Best Role Match: {data.get('best_role', '')}",
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
                Paragraph(f"• {item}", styles["Normal"])
            )

        content.append(Spacer(1, 10))

    doc.build(content)

    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            "attachment; filename=ResumeIQ_Report.pdf"
        }
    )
@app.post("/match-job-description")
async def match_job_description(file: UploadFile = File(...), job_description: str = ""):
    pdf_bytes = await file.read()

    reader = PdfReader(BytesIO(pdf_bytes))

    resume_text = ""
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            resume_text += extracted + "\n"

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

Resume:
{resume_text}

Job Description:
{job_description}
"""

    response = model.generate_content(prompt)

    raw_text = response.text.strip()
    cleaned = raw_text.replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(cleaned)
    except Exception:
        return {
            "match_score": 0,
            "matching_skills": [],
            "missing_keywords": [],
            "improvement_tips": [],
            "raw_output": raw_text
        }
    