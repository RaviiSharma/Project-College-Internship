
const express = require('express');
const router = express.Router();
const cc = require ("../controllers/collegeController")

router.post("/functionup/colleges", cc.createCollege)

module.exports = router;