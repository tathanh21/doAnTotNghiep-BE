const { reject } = require("lodash");
const db = require("../models");

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown || !data.address) {
                resolve({
                    errCode: 1,
                    message: "Missing parameter",
                });
            } else {
                await db.Clinic.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                    address:data.address
                })
                resolve({
                    errCode: 0,
                    errMessage:'ok'
                })
            }
        } catch (error) {
                reject(error)
        }
    })
}
let getAllClinic = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let data = await db.Clinic.findAll();
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item
                })
                
            }
        resolve({
            errCode: 0,
            errMessage: 'ok',
            data
        })
        } catch (error) {
            reject(error)
        }
    })
}
let getDetailClinicById = (inputId) => {
    return new Promise(async(resolve, reject) => {
        try {
             if (!inputId) {
                resolve({
                    errCode: 1,
                    message: "Missing parameter",
                });
              } else {
                    let  data = await db.Clinic.findOne({
                      where: {
                          id:inputId
                      },
                      attributes:['name','address','descriptionHTML','descriptionMarkdown']
                      })
                  if (data) {
                      let doctorClinic = [];
                          doctorClinic = await db.Doctor_Info.findAll({
                          where: { clinicId: inputId },
                          attributes:['doctorId'],
                          })
                            data.doctorClinic=doctorClinic 
                  }
                  else {
                      data={}
                  }
                    resolve({
                        errCode: 0,
                      errMessage: 'ok',
                      data
                    })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let deleteHandClinic = (id) => {
  return new Promise(async (resolve, reject) => {
    let clinic = await db.Clinic.findOne({
      where: { id: id },
    });
    if (!clinic) {
      resolve({
        errCode: 1,
        message: "clinic not exist",
      });
    }

    await db.Clinic.destroy({
      where: { id: id },
    });

    resolve({
      errCode: 0,
      message: "Delete clinic success",
    });
  });
};
let updateClinicData = (data) => {
  return new Promise(async (resolve, reject) => {
    // console.log('check data update',data.id)
    try {
      if (!data.id || !data.name || !data.address || !data.descriptionHTML || !data.descriptionMarkdown) {
        resolve({
          errCode: 2,
          message: "Missing parameter",
        });
      }
      let clinic = await db.Clinic.findOne({
        where: { id: data.id },
        raw: false,
      });
    //  console.log('check',handbook)

      if (clinic) {
        clinic.name = data.name;
        // handbook.image = data.image;
        clinic.descriptionHTML = data.descriptionHTML;
        clinic.descriptionMarkdown = data.descriptionMarkdown;
        if (data.image) {
          clinic.image = data.image;
        }
        await clinic.save();
        resolve({
          errCode: 0,
          message: "Update clinic success",
        });
      } else {
        resolve({
          errCode: 1,
          message: "Clinic not found",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById,
    deleteHandClinic,
    updateClinicData
}