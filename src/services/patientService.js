const { reject } = require("lodash")
import db from "../models/index";
import emailService from "./emailService";
import { v4 as uuidv4 } from 'uuid';
let buildUrlEmail = (doctorId,token) => {
    let result=`${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}
let postBookingAppointment = (data) => {
    // console.log(data)
    return new Promise(async(resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date
            || !data.fullName || !data.selectedGender || !data.address
            ) {
                resolve({
                  errCode: 1,
                  message: "Missing parameter",
           }); 
            } else {
                let token=uuidv4();
                await emailService.sendSimpleEmail({
                    reciverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language:data.language,
                    redirectLink:buildUrlEmail(data.doctorId,token)
                })

                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        gender: data.selectedGender,
                        address: data.address,
                        firstName:data.fullName
                    }
                });

                console.log('asdf',user[0].id)
                if (user && user[0]) {
                    console.log('find user')
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults:
                        {
                        statusId:'S1',
                        doctorId: data.doctorId,
                        patientId:user[0].id,
                        date: data.date,
                        timeType: data.timeType,
                        token:token
                       }
                    })
                    // let booking = await db.Booking.findOne({
                    //     where:{patientId:3}
                    // });

                    console.log('done')
                }
                resolve(
                    {
                       errCode: 0,
                       message: "Save info patient success", 
                    }
                )
        }    
        } catch (error) {
            reject(error)
        }
    })
}
let postVerifyBookingAppointment = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    message: "Missing parameter",
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId:"S1"
                    },
                    raw:false
                })
                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save()
                    resolve({
                    errCode: 0,
                    message: "Update the appointment success!",
                })
                } else {
                    resolve({
                    errCode: 2,
                    message: "Not found appointment",
                })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    postBookingAppointment,postVerifyBookingAppointment
}