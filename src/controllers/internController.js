const internModel = require("../models/internModel")
const collegeModel = require("../models/collegeModel")


const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value === "string") 
    return true;
};

const isvalidRequest = function (requestBody) {
  return Object.keys(requestBody).length > 0
}


const createIntern = async function (req, res) {
  try {
    const requestBody = req.body
    if (!isvalidRequest(requestBody)) return res.status(400).send({ status: false, message: "invalid request parameter ,please provied intern detail" })

    let { name, email, mobile, collegeName } = requestBody

    if (!isValid(name)) return res.status(400).send({ status: false, message: "Name is invalid" })
    if(!/^[a-zA-Z]+([\s][a-zA-Z]+)*$/.test(name)) return res.status(400).send({ status: false, message: "name should be correct format" })


    if (!isValid(email) || !(/^[a-z0-9_]{3,}@[a-z]{3,}.[a-z]{3,6}$/.test(email))) return res.status(400).send({ status: false, message: "email is incorrect" })
    
    //let Email = await internModel.findOne({ email })
    if (await internModel.findOne({ email })) return res.status(404).send({ status: false, message: "email is already used" })


    if (!isValid(mobile) || !(/^[6-9]{1}[0-9]{9}$/im.test(mobile))) return res.status(400).send({ status: false, message: "mobile is required or Mobile No is invalid" })
    
    //let checkMobile = await internModel.findOne({ mobile })
    if (await internModel.findOne({ mobile })) return res.status(404).send({ status: false, message: "Mobile Number is already used" })


    if (!collegeName || !isValid(collegeName)) return res.status(400).send({ status: false, message: "collegeName is required or collegeName is invalid" })
    //if (!isValid(collegeName)) return res.status(400).send({ status: false, message: "collegeName is invalid" })


    let collegeDoc = await collegeModel.findOne({ name: requestBody.collegeName })
    if(!collegeDoc) return res.status(404).send({status:false,message:"no such college is present"})
    requestBody.collegeId = collegeDoc._id
    let saveData = await internModel.create(requestBody)
    return res.status(201).send({ status: true, data: saveData })
  } catch (err) {
    return res.status(500).send({status: false,message: err.message })
  }
}

module.exports = {createIntern}