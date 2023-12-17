import clinicService from "../services/clinicService";
let createClinic = async(req, res) => {
       try {
       let info = await clinicService.createClinic(req.body);
       return res.status(200).json(info);
       } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error code from server ....",
    });
  }
}
let getAllClinic = async (req, res) => {
   try {
       let info = await clinicService.getAllClinic();
       return res.status(200).json(info);
       } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error code from server ....",
    });
  }
}
let getDetailClinicById = async (req, res) => {
   try {
       let info = await clinicService.getDetailClinicById(req.query.id);
       return res.status(200).json(info);
       } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error code from server ....",
    });
  }
}
let handleDeleteClinic = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing input parameter",
    });
  }
  let message = await clinicService.deleteHandClinic(req.body.id);
  return res.status(200).json({
    errCode: message.errCode,
    errMessage: message.message,
  });
};
let handleEditClinic = async (req, res) => {
  let data = req.body;
  let message = await clinicService.updateClinicData(data);
  return res.status(200).json({
    errCode: message.errCode,
    errMessage: message.message,
  });
};

module.exports = {
  createClinic: createClinic,
  getAllClinic: getAllClinic,
  getDetailClinicById: getDetailClinicById,
  handleDeleteClinic,
  handleEditClinic
}