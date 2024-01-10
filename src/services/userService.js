import { includes } from "lodash";
import db from "../models/index";
import bcrypt from "bcryptjs";

var salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        // User already exist
        let user = await db.User.findOne({
          where: { email: email },
          attributes: ["id","email", "password", "roleId", "firstName", "lastName"],
          raw: true,
        });
        if (user) {
          //compare password
          var hash = bcrypt.hashSync("B4c0//", salt);
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = `OK`;
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = `Wrong password`;
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = `User isn't not found`;
        }
      } else {
        // return err
        userData.errCode = 1;
        userData.errMessage = `Your's email isn't exist in your system, Plz try other email`;
      }
      resolve(userData);
    } catch (error) {
      reject(error);
    }
  });
};

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = await db.User.findAll({
           where: { roleId: 'R3' },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
        });
      }
      console.log('check user',users);
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};
let getAllDoctor = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = await db.User.findAll({
           where: { roleId: 'R2' },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
        });
      }
      console.log('check user',users);
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
}

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};
let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check email
      let check = await checkUserEmail(data.email);
      if (check === true) {
        resolve({
          errCode: 1,
          message: "Email already used!",
        });
      }
      else {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        db.User.create({
        email: data.email,
        password: hashPasswordFromBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        roleId: data.roleId,
        positionId: data.positionId,
        image: data.avatar,
      });
      resolve({
        errCode: 0,
        message: "OK",
      });
      }
      
    } catch (error) {
      reject(error);
    }
  });
};
let deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    let user = await db.User.findOne({
      where: { id: id },
    });
    if (!user) {
      resolve({
        errCode: 1,
        message: "User not exist",
      });
    }

    await db.User.destroy({
      where: { id: id },
    });

    resolve({
      errCode: 0,
      message: "Delete user success",
    });
  });
};
let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.roleId || !data.positionId || !data.gender) {
        resolve({
          errCode: 2,
          message: "Missing parameter",
        });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });

      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.roleId = data.roleId;
        user.positionId = data.positionId;
        user.gender = data.gender;
        user.phoneNumber = data.phoneNumber;
        if (data.avatar) {
          user.image = data.avatar;
        }
        await user.save();
        resolve({
          errCode: 0,
          message: "Update user success",
        });
      } else {
        resolve({
          errCode: 1,
          message: "User not found",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = {};
      if (!typeInput) {
        resolve({
          errCode: 1,
          errMessage: "Missing Parameter",
        });
      } else {
        let allcode = await db.Allcode.findAll({
          where: { type: typeInput },
        });
        res.errCode = 0;
        res.data = allcode;
        resolve(res);
      }
    } catch (error) {
      reject(error);
    }
  });
};
let loginEmailPatientService = (emailPatient) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!emailPatient) {
         resolve({
        errCode: 3,
        errMessage:'Vui lòng nhập email!'
     })
      }
      let patient = await db.User.findOne({
        where: { email: emailPatient, roleId: 'R3' },
        include: [
          {
            model: db.Booking,
            as: "patientData",
            include: [
              { model: db.Allcode, as: 'timeTypeDataPatient' },
              { model: db.Allcode, as: 'statusDataPatient' },
            ],
          },
        ],
       
         raw: true,
         nest: true,
      });
      if (!patient) {
          resolve({
        errCode: 1,
        errMessage:'Không tìm thấy email, Vui lòng kiểm tra lại'
          })
        return;
      }
console.log('check patient',patient);
      // let doctorId= patient.patientData.doctorId
      // let doctorName = await db.User.findOne({
      //    where: { doctorId: doctorId }
      // })

      // console.log('---',doctorName)
      resolve({
        errCode: 0,
        patient: patient,
        
     })
    } catch (error) {
      reject(error);
    }
  });
};



let patientCancelBooking = (data) => {
  return new Promise(async (resolve, reject) => {
    console.log('dâtta',data)
    try {
      if (!data.data.email) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required param!'
        })
      } else { 
        
        //update patient status
        let appointment = await db.Booking.findOne({
          where:{
            doctorId: data.data.doctorId,
            patientId: data.data.patientId,
            timeType: data.data.timeType,
          },
          raw:false
        })
        if (appointment) {
          // console.log('email',appointment)
          appointment.statusId = 'S4';
          await appointment.save();
        }
        
       resolve({
          errCode:0,
          errMessage:'Hủy lịch hẹn thành công!'
        })
      }
    } catch (error) {
      reject(error)
    }
  })
}
module.exports = {
  handleUserLogin: handleUserLogin,
  getAllUser: getAllUser,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  updateUserData: updateUserData,
  getAllCodeService: getAllCodeService,
  loginEmailPatientService: loginEmailPatientService,
  patientCancelBooking: patientCancelBooking,
  getAllDoctor:getAllDoctor
};
