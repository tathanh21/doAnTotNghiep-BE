import db from "../models/index";
import user from "../models/user";
let getTopDoctorHome = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limitInput,
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attribute: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attribute: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attribute: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: users,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
      });
      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let saveDetailInfoDoctor = (inputData) => {
  console.log(inputData);
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !inputData.doctorId ||
        !inputData.contentHTML ||
        !inputData.contentMarkdown
      ) {
        resolve({
          errCode: 1,
          message: "Missing parameter",
        });
      } else {
        await db.Markdown.create({
          contentHTML: inputData.contentHTML,
          contentMarkdown: inputData.contentMarkdown,
          description: inputData.description,
          doctorId: inputData.doctorId,
        });
        resolve({
          errCode: 0,
          message: "Save info doctor success",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getDetailDoctorById=(inputId)=>{
  return new Promise(async(resolve,reject)=>{
    try {
      if(!inputId){
        resolve({
          errCode:1,
          message:'Missing parameter'
        })
      }else{
        let data= await  db.User.findOne({
          where:{
            id:inputId
          },
          attributes:{
            exclude:['password']
          },
          include:[
            {model:db.Markdown,
              attributes:['description','contentMarkdown','contentHTML']
            },
            {model:db.Allcode,as:'positionData', attributes:['valueEn','valueVi']}
          ],
          raw:false,
          nest:true
        })
        if(data && data.image){
          data.image = new Buffer(data.image, "base64").toString("binary");
        }
        if(!data) data={}
        resolve({
          errCode:0,
          data:data
        })
      }
    } catch (error) {
      reject(error)
    }
  })
}
module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  saveDetailInfoDoctor: saveDetailInfoDoctor,
  getDetailDoctorById:getDetailDoctorById
};
