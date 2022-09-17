const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");
const url = require("valid-url");

const createCollege = async (req, res) => {
  try {
    let data = req.body;

    const { name, fullName, logoLink } = data; //destructuring required fields

    if (Object.keys(data) == 0)
      return res
        .status(400)
        .send({ status: false, message: "Please provide all data" });

    // in case name is not given or not correct
    if (!name || !name.match(/^[a-z]((?![? .,'-]$)[ .]?[a-z]){1,10}$/g)) {
      return res
        .status(400)
        .send({ status: false, msg: "Name is mandatory & should be unique" });
    }
    //in case full name is not present
    if (
      !fullName ||
      !fullName.match(/^[a-z]((?![? .,'-]$)[ .]?[a-z]){3,150}$/gi)
    ) {
      return res
        .status(400)
        .send({ status: false, msg: "Full name is mandatory " });
    }
    //if the logoLink is not present
    if (!logoLink || !url.isUri(logoLink)) {
      return res
        .status(400)
        .send({ status: false, msg: "Logo link is mandatory" });
    }
    //in case this college does not exists
    if (!(await collegeModel.exists({ name: data.name }))) {
      // creating a new college document
      let college = await collegeModel.create(data);
      //sending the response
      return res.status(201).send({
        status: true,
        msg: "Your college has been registered",
        data: college,
      });
    } else {
      //response in case the data already exists in db
      return res.status(400).send({
        status: false,
        msg: "this college name is already registered",
      });
    }
  } catch (err) {
    return res.status(500).send({ status: false, err: err.message });
  }
}; // validation ends here

const collegeDetails = async (req, res) => {
  try {
    let data = req.query;
    let { collegeName } = data; //destructuring the collegeName from the data

    //response in case collegeName is not present
    if (
      !collegeName ||
      !/^[a-z]((?![? .,'-]$)[ .]?[a-z]){1,10}$/g.test(collegeName)
    ) {
      return res.status(400).send({
        status: false,
        msg: "College Name is required to perform this action",
      });
    }
    let findcollege = await collegeModel
      .findOne({ name: collegeName, isDeleted: false })
      .select({ _id: 1, name: 1, logoLink: 1, fullName: 1 }); //selecting the required fields

    // in caase no college was found, this would be our response
    if (!findcollege) {
      return res
        .status(404)
        .send({ status: false, msg: "No college with this name exists" });
    }
    let collegeId = findcollege._id; //storing the id of the college with find from the name inside a variable collegeId

    //searching for candidates inside the intern model and selecting their name, email, and mobiles
    let candidates = await internModel
      .find({ collegeId: collegeId, isDeleted: false })
      .select({ name: 1, email: 1, mobile: 1 });

    // since find gives us an array, we can check for its length and in case it's zero, this would be our response
    if (!candidates.length) {
      return res.status(404).send({
        status: false,
        msg: "no students from this college has applied yet",
      });
    }
    //creating a details object with all the required keys and values
    let details = {
      name: findcollege.name,
      fullName: findcollege.fullName,
      logoLink: findcollege.logoLink,
      interns: candidates,
    };
    //sending newly created details document
    return res.status(200).send({ status: true, data: details });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = { createCollege, collegeDetails };
