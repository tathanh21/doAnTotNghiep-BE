import { raw } from "body-parser";
import db from "../models/index";
import user from "../models/user";
import _, { reject }  from "lodash"
import emailService from "./emailService";
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
let checkRe
let saveDetailInfoDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log('check input',inputData)
      if (
        !inputData.doctorId ||
        !inputData.contentHTML ||
        !inputData.contentMarkdown || !inputData.action ||
        !inputData.selectedPrice || !inputData.selectedPayment ||
        !inputData.selectedProvince ||
        !inputData.nameClinic || !inputData.addressClinic || !inputData.note ||
        !inputData.specialtyId
      ) {
        resolve({
          errCode: 1,
          message: "Missing parameter",
        });
      } else {
        //upsert to markdown
        if (inputData.action === 'CREATE') {
            await db.Markdown.create({
          contentHTML: inputData.contentHTML,
          contentMarkdown: inputData.contentMarkdown,
          description: inputData.description,
          doctorId: inputData.doctorId,
        });
        } else if(inputData.action === 'EDIT') {
          let doctorMarkdown = await db.Markdown.findOne({
            where: { doctorId: inputData.doctorId },
            raw:false
          })
          if (doctorMarkdown) {
            doctorMarkdown.contentHTML = inputData.contentHTML;
            doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
            doctorMarkdown.description = inputData.description;
            await doctorMarkdown.save()
          }
        }
      //upsert to doctor info
        let doctorInfo = await db.Doctor_Info.findOne({
          where: { doctorId: inputData.doctorId },
          raw:false
        })

        if (doctorInfo) {
          //update
          doctorInfo.doctorId = inputData.doctorId;
          doctorInfo.priceId = inputData.selectedPrice;
          doctorInfo.paymentId = inputData.selectedPayment;
          doctorInfo.provinceId = inputData.selectedProvince;
          doctorInfo.nameClinic = inputData.nameClinic;
          doctorInfo.addressClinic = inputData.addressClinic;
          doctorInfo.note = inputData.note;
          doctorInfo.specialtyId = inputData.specialtyId;
          doctorInfo.clinicId = inputData.clinicId;
          await doctorInfo.save();
        } else {
          //create
          await db.Doctor_Info.create({
          doctorId:inputData.doctorId,
          priceId : inputData.selectedPrice,
          paymentId : inputData.selectedPayment,
          provinceId : inputData.selectedProvince,
          nameClinic : inputData.nameClinic,
          addressClinic : inputData.addressClinic,
          note: inputData.note,
          specialtyId: inputData.specialtyId,
          clinicId:inputData.clinicId
          })
        }
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
            {
              model: db.Doctor_Info,
              attributes: {
                exclude:['id','doctorId']
              },
              include: [
                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] }
              ]
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
let bulkCreateSchedule = (data) => {
  return new Promise(async(resolve, reject) => {
    try {
      if (!data.arrSchedule || !data.doctorId || !data.date) {
        resolve({
          errCode: 1,
          errMessage:'Missing required param!'
        })
      } else {
        let schedule = data.arrSchedule;
        if (schedule && schedule.length > 0) {
          schedule = schedule.map(item => {
            item.maxNumber = 10;
            return item;
          })
        }
        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId,date:data.date },
          attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
          raw:true
        })
        // if (existing && existing.length > 0) {
        //   existing = existing.map(item => {
        //     item.date = new Date(item.date).getTime();
        //     return item;
        //   })
        // }
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        })
        if (toCreate && toCreate.length > 0) {
        await db.Schedule.bulkCreate(toCreate)
        }
        resolve({
          errCode: 0,
          errMessage:'OK'
        })
        
      }

    } catch (error) {
      reject(error)
    }
  })
}
let getScheduleByDate = (doctorId, date) => {
  return new Promise(async(resolve, reject) => {
    try {
      if (!doctorId || !date) {
         resolve({
          errCode: 1,
          errMessage:'Missing required param!'
        })
      } else {
        let dataSchedule = await db.Schedule.findAll({
          where: { doctorId: doctorId, date: date },
          include: [
            { model: db.Allcode, as: 'timeTypeData', attributes: ['valueVi', 'valueEn'] },
            { model:db.User,as:'doctorData',attributes:['firstName','lastName']}
          ],
          raw: false,
          nest:true
        });
        if (!dataSchedule) dataSchedule = [];
         resolve({
          errCode: 0,
          data:dataSchedule
        })
      }
    } catch (error) {
      reject(error)
    }
  })
}
let getExtraDoctorById = (doctorId) => {
  return new Promise(async(resolve, reject) => {
    try {
      if (!doctorId) {
         resolve({
          errCode: 1,
          errMessage:'Missing required param!'
        })
      } else {
        let data = await db.Doctor_Info.findOne({
          where: { doctorId: doctorId },
          attributes: {
            exclude:['id','doctorId']
          },
          include: [
              { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] }
          ],
          raw: false,
          nest:true
        })
        if (!data) data = {};
        resolve({
          errCode: 0,
          data:data
        })
      }
    } catch (error) {
      reject(error)
    }
  })
}
let getProflieDoctorById = (doctorId) => {
  return new Promise(async(resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required param!'
        })
      } else {
         let data= await  db.User.findOne({
          where:{
            id:doctorId
          },
          attributes:{
            exclude:['password']
          },
          include:[
             {model:db.Markdown,
              attributes:['description','contentMarkdown','contentHTML']
            },
            {
              model: db.Doctor_Info,
              attributes: {
                exclude:['id','doctorId']
              },
              include: [
                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] }
              ]
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

let getListPatientForDoctor = (doctorId, date) => {
  return new Promise(async(resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required param!'
        })
      } else { 
        let data = await db.Booking.findAll({
          where: {
            statusId: 'S2',
            doctorId: doctorId,
            date:date
          },
          include: [
            {
              model: db.User,as:'patientData',
              attributes: ['email', 'firstName', 'address', 'gender'],
              include: [
                  {model:db.Allcode,as:'genderData', attributes:['valueEn','valueVi']}
              ]
            },
            {
              model: db.Allcode,as:'timeTypeDataPatient',attributes:['valueEn','valueVi']
            }
          ],
            raw: false,
            nest:true
        })
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

let sendRemedy = (data) => {
  return new Promise(async(resolve, reject) => {
    try {
      if (!data.email || !data.doctorId || !data.patientId) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required param!'
        })
      } else { 
        //update patient status
        let appointment = await db.Booking.findOne({
          where:{
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType,
            statusId:'S2'
          },
          raw:false
        })
        if (appointment) {
          appointment.statusId = 'S3';
          await appointment.save();
        }
        // send email remedy
        await emailService.sendAttachment(data);
       resolve({
          errCode:0,
          errMessage:'OK'
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
  getDetailDoctorById: getDetailDoctorById,
  bulkCreateSchedule: bulkCreateSchedule,
  getScheduleByDate: getScheduleByDate,
  getExtraDoctorById: getExtraDoctorById,
  getProflieDoctorById: getProflieDoctorById,
  getListPatientForDoctor: getListPatientForDoctor,
  sendRemedy:sendRemedy
};
