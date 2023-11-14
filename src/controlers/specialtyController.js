import specialtyService from "../services/specialtyService";
let createSpecialty = async(req, res) => {
       try {
       let info = await specialtyService.createSpecialty(req.body);
       return res.status(200).json(info);
       } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error code from server ....",
    });
  }
}
let getAllSpecialty = async (req, res) => {
     try {
       let info = await specialtyService.getAllSpecialty();
       return res.status(200).json(info);
       } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error code from server ....",
    });
  }
}
let getDetailSpecialtyById = async (req, res) => {
   try {
       let info = await specialtyService.getDetailSpecialtyById(req.query.id,req.query.location);
       return res.status(200).json(info);
       } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error code from server ....",
    });
  }
}

let handleDeleteSpecialty = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing input parameter",
    });
  }
  let message = await specialtyService.deleteSpecialty(req.body.id);
  return res.status(200).json({
    errCode: message.errCode,
    errMessage: message.message,
  });
};
let handleEditSpecialty = async (req, res) => {
  let data = req.body;
  let message = await specialtyService.updateSpecialtyData(data);
  return res.status(200).json({
    errCode: message.errCode,
    errMessage: message.message,
  });
};
module.exports = {
    createSpecialty: createSpecialty,
  getAllSpecialty: getAllSpecialty,
  getDetailSpecialtyById: getDetailSpecialtyById,
  handleDeleteSpecialty,
    handleEditSpecialty
}