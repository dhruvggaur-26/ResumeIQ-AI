# ResumeIQ-AI

ResumeIQ-AI is an AI-powered resume analysis platform where users can upload their resume, extract resume content, analyze it using AI, get ATS-style feedback, identify missing skills, and receive personalized improvement suggestions to make their resume more job-ready.

## Features

* Resume upload and PDF text extraction
* AI-powered resume analysis using Gemini API
* ATS-style resume feedback and scoring
* Skill-gap analysis based on resume content
* Personalized resume improvement suggestions
* Job-fit insights for better career targeting
* Clean and responsive dashboard UI
* Fast API-based backend for resume processing
* Frontend-backend integration using REST APIs
* Modern responsive UI built with React and Tailwind CSS

## Tech Stack

### Frontend

* React.js
* Tailwind CSS
* JavaScript
* Vite
* Axios
* React Router
* Lucide React

### Backend

* FastAPI
* Python
* Uvicorn
* PyPDF
* Google Gemini API
* python-dotenv
* CORS

## Project Structure

```txt
ResumeIQ-AI/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│   └── README.md
│
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone <your-repository-link>
cd ResumeIQ-AI
```

### 2. Install frontend dependencies

```bash
cd client
npm install
npm run dev
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd server
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

## Environment Variables

Create a `.env` file inside the `server` folder:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Do not push the `.env` file to GitHub.

## API Endpoints

```txt
GET    /                 Backend health check
GET    /test-ai          Test Gemini AI response
POST   /extract-text     Extract text from uploaded resume
POST   /analyze-resume   Analyze resume using AI
```

## Usage

1. Open the frontend in the browser.
2. Upload your resume in PDF format.
3. The backend extracts text from the uploaded resume.
4. The extracted resume content is sent to Gemini AI.
5. AI analyzes the resume and generates feedback.
6. User receives ATS-style suggestions, skill-gap insights, and improvement points.

## Current Limitations

* Resume analysis currently depends on extracted PDF text quality.
* Only PDF resume upload is currently supported.
* User authentication and resume history are not added yet.
* Job recommendation system can be improved using database and embeddings.
* AI output may vary depending on the resume content and prompt quality.

## Future Improvements

* Add user authentication
* Store resume history using MongoDB
* Add job recommendation system
* Add resume score comparison
* Add downloadable AI-generated resume report
* Add support for DOCX resume upload
* Add dashboard for previous resume analyses
* Improve ATS scoring accuracy
* Deploy frontend and backend online

## What I Learned

* Built a full-stack AI-powered web application
* Integrated React frontend with FastAPI backend
* Implemented PDF text extraction using Python
* Used Gemini API for AI-based resume analysis
* Managed file upload and API communication
* Created a responsive UI using Tailwind CSS
* Learned how to structure and deploy AI-based projects

## Author

Dhruv Gaur

## Live Demo

Frontend: <add-your-frontend-live-link>  
Backend: <add-your-backend-live-link>
