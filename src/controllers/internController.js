const internModel = require("../models/internModel");
const collegeModel = require("../models/collegeModel");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value === "string") return true;
};

const isvalidRequest = (requestBody) => {
  return Object.keys(requestBody).length > 0;
};

const createIntern = async (req, res) => {
  try {
    const requestBody = req.body;

    let { name, email, mobile, collegeName } = requestBody;

    if (Object.keys(requestBody) == 0)
      return res
        .status(400)
        .send({ status: false, message: "Please provide all data" });

    if (!isValid(name) || !/^[a-zA-Z]+([\s][a-zA-Z]+)*$/.test(name))
      return res.status(400).send({
        status: false,
        message: "Name is mandatory & should be in correct format",
      });

    if (!isValid(email) || !/^[a-z0-9_]{3,}@[a-z]{3,}.[a-z]{3,6}$/.test(email))
      return res
        .status(400)
        .send({ status: false, message: "Email is mandatory & valid" });

    if (await internModel.findOne({ email }))
      return res
        .status(400)
        .send({ status: false, message: "Email should be unique" });

    if (!isValid(mobile) || !/^[6-9]{1}[0-9]{9}$/im.test(mobile))
      return res.status(400).send({
        status: false,
        message:
          "Mobile is mandatory & should be in valid format (10 digit Indian number)",
      });

    if (await internModel.findOne({ mobile }))
      return res
        .status(404)
        .send({ status: false, message: "Mobile Number should be unique" });

    if (!collegeName || !isValid(collegeName))
      return res.status(400).send({
        status: false,
        message: "collegeName is mandatory & should be valid",
      });

    let collegeDoc = await collegeModel.findOne({
      name: requestBody.collegeName,
    });
    if (!collegeDoc)
      return res
        .status(404)
        .send({ status: false, message: "no such collegeName is present" });

    requestBody.collegeId = collegeDoc._id;
    let saveData = await internModel.create(requestBody);
    return res.status(201).send({ status: true, data: saveData });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { createIntern };
