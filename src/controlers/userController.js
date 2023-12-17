import userService from "../services/userService";

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameter",
    });
  }
  let userData = await userService.handleUserLogin(email, password);
  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    userData: userData.user ? userData.user : {},
  });
};
let handleGetAllUsers = async (req, res) => {
  let id = req.query.id;
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing input parameter",
      users: [],
    });
  }
  let users = await userService.getAllUser(id);
  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    users,
  });
};
let handleCreateNewUser = async (req, res) => {
  let message = await userService.createNewUser(req.body);
  // console.log(message);
  return res.status(200).json({
    errCode: message.errCode,
    errMessage: message.message,
  });
};
let handleEditUser = async (req, res) => {
  let data = req.body;
  let message = await userService.updateUserData(data);
  return res.status(200).json({
    errCode: message.errCode,
    errMessage: message.message,
  });
};
let handleDeleteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing input parameter",
    });
  }
  let message = await userService.deleteUser(req.body.id);
  return res.status(200).json({
    errCode: message.errCode,
    errMessage: message.message,
  });
};
let getAllCode = async (req, res) => {
  try {
    // setTimeout(async () => {
    let data = await userService.getAllCodeService(req.query.type);
    return res.status(200).json(data);
    // }, 3000);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};


let loginEmailPatient = async (req, res) => {
  try {
    let data = await userService.loginEmailPatientService(req.body.email);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let cancelBookingPatient = async (req, res) => {
  try {
    let data = await userService.patientCancelBooking(req.body);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

module.exports = {
  handleLogin: handleLogin,
  handleGetAllUsers: handleGetAllUsers,
  handleCreateNewUser: handleCreateNewUser,
  handleEditUser: handleEditUser,
  handleDeleteUser: handleDeleteUser,
  getAllCode: getAllCode,
  loginEmailPatient: loginEmailPatient,
  cancelBookingPatient:cancelBookingPatient
};
