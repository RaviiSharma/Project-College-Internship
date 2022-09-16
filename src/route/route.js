const express = require("express");
const router = express.Router();
const cc = require("../controllers/collegeController");
const ic = require("../controllers/internController");

router.post("/functionup/colleges", cc.createCollege);
router.post("/functionup/interns", ic.createIntern);
router.get("/functionup/collegeDetails", cc.collegeDetails);

router.all("/*", function (req, res) {
  res.status(400).send({
    status: false,
    message: "The api you request is not available",
  });
});

module.exports = router;
