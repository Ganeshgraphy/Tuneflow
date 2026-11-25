const express = require("express");
const router = express.Router();
const musicController = require("../controllers/music.controller");
const multer = require("multer");
const authMiddleware = require("../middleware/auth.middleware");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", authMiddleware.artistAuth, upload.single("music"), musicController.createMusic);

router.post("/album", authMiddleware.artistAuth, musicController.createAlbum)

router.get("/", musicController.getAllMusics)

module.exports = router;
