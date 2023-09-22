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
module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty:getAllSpecialty
}