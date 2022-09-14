const collegeModel = require("../models/collegeModel");
const url = require("valid-url")

const createCollege = async (req, res) => {
  try {
    let data = req.body;

    const { name, fullName, logoLink } = data; //destructuring required fields

    // in case name is not given
    if (!name) {
      return res
        .status(400)
        .send({ status: false, msg: "name is a required field" });
    }

    //creating pattern for valid name
    const namePattern = /^[a-z]((?![? .,'-]$)[ .]?[a-z]){1,10}$/g;
    // checking if the name is valid
    if (!name.match(namePattern)) {
      return res
        .status(400)
        .send({ status: false, msg: "This is not a valid Name" });
    }
    //in case full name is not present
    if (!fullName) {
      return res
        .status(400)
        .send({ status: false, msg: "fullName is a required field" });
    }
    //creating pattern for valid fullname -case insentitive
    const fullNamePattern = /^[a-z]((?![? .,'-]$)[ .]?[a-z]){3,150}$/gi;
    //valdiating the full name
    if (!fullName.match(fullNamePattern)) {
      return res
        .status(400)
        .send({ status: false, msg: "This is not a valid full Name" });
    }
    //if the logoLink is not present
    if (!logoLink) {
      return res
        .status(400)
        .send({ status: false, msg: "logoLink is a required field" });
    }

    //using valid-url to valdiate the email
    const validateLogoLink = url.isUri(logoLink);

    if (!validateLogoLink) {
      return res
        .status(400)
        .send({ status: false, msg: "This is not a valid logoLink" });
    }
    //in case this college already does not exists
    if (!await collegeModel.exists({ name: data.name })) {
      // creating a new college document
      let college = await collegeModel.create(data);
      //sending the response
      return res
        .status(201)
        .send({
          status: true,
          msg: "Your college has been registered",
          data: college,
        });
    } else {
      //response in case the data already exists in db
      return res
        .status(400)
        .send({
          status: false,
          msg: "this college name is already registered",
        });
    }
  } catch (err) {
    return res.status(500).send({ status: false, err: err.message });
  }
};
module.exports.createCollege = createCollege;
