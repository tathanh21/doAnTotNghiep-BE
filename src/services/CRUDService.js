import bcrypt from "bcryptjs";
var salt = bcrypt.genSaltSync(10);
import db from "../models/index";
let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswordFromBcrypt = await hashUserPassword(data.password);
      db.User.create({
        email: data.email,
        password: hashPasswordFromBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        gender: data.gender === "1" ? true : false,
        phoneNumber: data.phoneNumber,
        roleId: data.roleId,
      });
      resolve("create New User Sucsess");
    } catch (error) {
      reject(error);
    }
  });
};
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

let getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        raw: true,
      });
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};
let getEditCRUD = (eidtId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.User.findOne({
        where: { id: eidtId },
        raw: true,
      });
      if (data) {
        resolve(data);
      } else {
        resolve({});
      }
    } catch (error) {
      reject(error);
    }
  });
};
let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: data.id },
      });
      if (user) {
        (user.firstName = data.firstName),
          (user.lastName = data.lastName),
          (user.address = data.address);
        await user.save();

        let users = await db.User.findAll();
        resolve(users);
      } else {
        resolve();
      }
    } catch (error) {
      reject(error);
    }
  });
};

let deleteUserById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
      });
      if (user) {
        await user.destroy();
      }
      let users = await db.User.findAll();
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  createNewUser: createNewUser,
  getAllUser: getAllUser,
  getEditCRUD: getEditCRUD,
  updateUserData: updateUserData,
  deleteUserById: deleteUserById,
};
