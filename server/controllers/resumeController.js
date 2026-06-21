const Resume = require("../models/Resume");
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");



const uploadResume = async (req, res) => {
  console.log(req.file);
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const resume = await Resume.create({
      user: req.user.id,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    });

    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      resume,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};





const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};




const analyzeResume = async (req, res) => {
  try {
    // Find the latest uploaded resume of the logged-in user
    const resume = await Resume.findOne({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "No resume found",
      });
    }

    // Create form-data
    const formData = new FormData();

    formData.append(
      "file",
      fs.createReadStream(resume.filePath)
    );

    // Send PDF to FastAPI
    const response = await axios.post(
      "http://127.0.0.1:8000/analyze-resume",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    return res.status(200).json({
      success: true,
      analysis: response.data.analysis,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};




module.exports = {
  uploadResume,
  getMyResumes,
  analyzeResume,
};