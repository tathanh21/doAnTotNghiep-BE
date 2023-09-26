import { query } from "express";
import doctorService from "../services/doctorService";
let getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10;
  try {
    let response = await doctorService.getTopDoctorHome(+limit);
    // console.log(response);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: 1,
      message: "Error code from server ....",
    });
  }
};
let getAllDoctors = async (req, res) => {
  try {
    let doctors = await doctorService.getAllDoctors();
    return res.status(200).json(doctors);
  } catch (error) {
    console.log(error);
    res.status(200).json({
      errCode: -1,
      message: "Error code from server ....",
    });
  }
};
let postInfoDoctor = async (req, res) => {
  try {
    let response = await doctorService.saveDetailInfoDoctor(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error code from server ....",
    });
  }
};
let getDetailDoctorById=async(req,res)=>{
  try {
    let info= await doctorService.getDetailDoctorById(req.query.id);
    return res.status(200).json(info)
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error code from server ....",
    });
  }
}
let bulkCreateSchedule = async(req,res) => {
  try {
     let info= await doctorService.bulkCreateSchedule(req.body);
    return res.status(200).json(info)
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error code from server ....",
    });
  }
}
let getScheduleByDate = async (req, res)=>{
  try {
     let info = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date);
    return res.status(200).json(info);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error code from server ....",
    });
  }
}
let getExtraDoctorById = async (req, res) => {
   try {
     let info = await doctorService.getExtraDoctorById(req.query.doctorId);
    return res.status(200).json(info);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error code from server ....",
    });
  }
}
let getProflieDoctorById = async (req, res) => {
     try {
     let info = await doctorService.getProflieDoctorById(req.query.doctorId);
    return res.status(200).json(info);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error code from server ....",
    });
  }
}
let getListPatientForDoctor = async(req,res)=> {
   try {
     let info = await doctorService.getListPatientForDoctor(req.query.doctorId,req.query.date);
    return res.status(200).json(info);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error code from server ....",
    });
  } 
}
let sendRemedy = async(req,res)=> {
   try {
     let info = await doctorService.sendRemedy(req.body);
    return res.status(200).json(info);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error code from server ....",
    });
  } 
}

module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  postInfoDoctor: postInfoDoctor,
  getDetailDoctorById: getDetailDoctorById,
  bulkCreateSchedule: bulkCreateSchedule,
  getScheduleByDate: getScheduleByDate,
  getExtraDoctorById: getExtraDoctorById,
  getProflieDoctorById: getProflieDoctorById,
  getListPatientForDoctor: getListPatientForDoctor,
  sendRemedy:sendRemedy
};
