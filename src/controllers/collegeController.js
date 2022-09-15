const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel")
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


const collegeDetails = async (req,res)=>{
    try {
        let data = req.query
        let {collegeName} = data //destructuring the collegeName from the data
         
        if(!collegeName){
             return res.status(400).send({status : false, msg : "College Name is required to perform this action"})
         } //response in case college name is not present

        let namePattern = /^[a-z]((?![? .,'-]$)[ .]?[a-z]){1,10}$/g //creating a valid name pattern
        
        if(!collegeName.match(namePattern)){
             return res.status(400).send({status : false, msg : "This is not a valid college Name"})
        } // matching the name we got in the request again the valid pattern and the response if it fails. 
        // in case it matches then we will try to find the college with that name we were given in the request
        
        let findcollege = await collegeModel.findOne({name: collegeName, isDeleted: false}).select({_id: 1, name: 1, logoLink: 1, fullName: 1}) //selecting the required fields

        if(!findcollege){
            return res.status(400).send({ status: false, msg: "No college with this name exists" })
        } // in caase no college was found, this would be our response

        let collegeId = findcollege._id //storing the id of the college with find from the name inside a variable collegeId

        let candidates = await internModel.find({collegeId : collegeId, isDeleted : false}).select({name : 1, email : 1, mobile : 1})
        //searching for candidates inside the intern model and selecting their name, email, and mobiles
        if(!candidates.length){
            return res.status(400).send({ status: false, msg: "no students from this college has applied yet" })
        } // since find gives us an array, we can check for its length and in case it's zero, this would be our response

        let details = {
            name : findcollege.name,
            fullName : findcollege.fullName,
            logoLink : findcollege.logoLink,
            intrests : candidates

        } //creating a details object with all the required keys and values

        return res.status(200).send({ status: true, data: details }) //sending newly created details document

    } catch (error) {
        
        return res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports = {createCollege, collegeDetails}
