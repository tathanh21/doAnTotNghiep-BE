const { reject } = require("lodash");
const db = require("../models");

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        // console.log(data)
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
module.exports = {
    createClinic:createClinic
}