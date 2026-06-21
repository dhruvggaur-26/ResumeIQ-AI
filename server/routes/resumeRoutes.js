const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../config/multer");

const {
  uploadResume,
  getMyResumes,
  analyzeResume,
} = require("../controllers/resumeController");

router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);


router.get("/my", protect, getMyResumes);
router.post("/analyze", protect, analyzeResume);


module.exports = router;