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

module.exports = {
    createClinic:createClinic
}