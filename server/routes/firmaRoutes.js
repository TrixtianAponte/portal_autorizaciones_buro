const express = require("express");
const { saveSignature } = require("../controllers/firmaController");
const router = express.Router();

router.post("/save", saveSignature);

module.exports = router;

