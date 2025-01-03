const express = require("express");
const { upload, validateFile } = require("../upload");
const fileController = require("./file.controller");

const router = express.Router();

/** Upload small size file */
router.post(
  "/upload",
  upload.single("file"),
  validateFile("single", {
    size: 2 * 1024 * 1024, // 2 MB
    ext: ["jpg", "png", "jpeg", "gif"],
    limit: 1,
    required: true,
  }),
  fileController.uploadFile
);

/** Upload big size file */
router.post(
  "/upload-multipart",
  upload.single("file"),
  validateFile("single", {
    ext: ["mov", "mp4", "mkv"],
    limit: 1,
    required: true,
  }),
  fileController.uploadMultipartFile
);

/** Delete file */
router.delete("/delete", fileController.deleteFile);

/** Delete multiple files */
router.delete("/delete-multiple", fileController.deleteMultipleFiles);

module.exports = router;
