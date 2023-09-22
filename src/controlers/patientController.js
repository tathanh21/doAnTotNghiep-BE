import patientService from "../services/patientService";
let postBookingAppointment = async (req, res) => {
       try {
       let info = await patientService.postBookingAppointment(req.body);
       return res.status(200).json(info);
       } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error code from server ....",
    });
  }
}
let postVerifyBookingAppointment = async (req, res) => {
       try {
       let info = await patientService.postVerifyBookingAppointment(req.body);
       return res.status(200).json(info);
       } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error code from server ....",
    });
  }
}

module.exports = {
  postBookingAppointment: postBookingAppointment,
  postVerifyBookingAppointment:postVerifyBookingAppointment
}