const { reject } = require("lodash");
const db = require("../models");

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        // console.log(data)
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    message: "Missing parameter",
                });
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown:data.descriptionMarkdown
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
let getAllSpecialty = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();
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
let getDetailSpecialtyById = (inputId,location) => {
    return new Promise(async(resolve, reject) => {
        try {
              if (!inputId,!location) {
                resolve({
                    errCode: 1,
                    message: "Missing parameter",
                });
              } else {
                    let  data = await db.Specialty.findOne({
                      where: {
                          id:inputId
                      },
                      attributes:['descriptionHTML','descriptionMarkdown']
                      })
                  if (data) {
                      let doctorSpecialty = [];
                      if (location === 'ALL') {
                          doctorSpecialty = await db.Doctor_Info.findAll({
                          where: { specialtyId: inputId },
                          attributes:['doctorId','provinceId'],
                          })
                      } else {
                          doctorSpecialty = await db.Doctor_Info.findAll({
                              where: { specialtyId: inputId, provinceId: location },
                               attributes:['doctorId','provinceId'],
                          })
                      }
                        
                            data.doctorSpecialty=doctorSpecialty 
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
module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById:getDetailSpecialtyById
}