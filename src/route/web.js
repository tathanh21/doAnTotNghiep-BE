import express from "express";
import homeController from "../controlers/homeController";
import userController from "../controlers/userController";
import doctorControler from "../controlers/doctorController";
import patientController from "../controlers/patientController";
import specialtyController from "../controlers/specialtyController";
import clinicController from "../controlers/clinicController";
let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomeController);
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.displayGetCRUD);
  router.get("/edit-crud", homeController.getEditCRUD);
  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);

  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);
  router.get("/api/allcode", userController.getAllCode);
  router.get("/api/top-doctor-home", doctorControler.getTopDoctorHome);
  router.get("/api/get-all-doctor", doctorControler.getAllDoctors);
  router.post("/api/save-info-doctor", doctorControler.postInfoDoctor);
  router.get("/api/get-detail-doctor-by-id", doctorControler.getDetailDoctorById);
  router.post("/api/bulk-create-schedule", doctorControler.bulkCreateSchedule);
  router.get("/api/get-schedule-doctor-by-date", doctorControler.getScheduleByDate);
  router.get("/api/get-extra-info-doctor-by-id", doctorControler.getExtraDoctorById);
  router.get("/api/get-profile-doctor-by-id", doctorControler.getProflieDoctorById);

  router.get("/api/get-list-patient-for-doctor", doctorControler.getListPatientForDoctor);
  router.post("/api/send-remedy", doctorControler.sendRemedy);

  router.post("/api/patient-book-appointment", patientController.postBookingAppointment);
  router.post("/api/verify-book-appointment", patientController.postVerifyBookingAppointment);
  
  router.post("/api/create-new-specialty", specialtyController.createSpecialty)
  router.get("/api/get-all-specialty", specialtyController.getAllSpecialty);
  router.get("/api/get-detail-specialty-by-id", specialtyController.getDetailSpecialtyById)
  
  router.post("/api/create-new-clinic", clinicController.createClinic)
  router.get("/api/get-all-clinic", clinicController.getAllClinic);
  router.get("/api/get-detail-clinic-by-id",clinicController.getDetailClinicById)

  return app.use("/", router);
};

module.exports = initWebRoutes;
