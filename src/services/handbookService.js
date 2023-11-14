const { reject } = require("lodash");
const db = require("../models");

let createHandbook = (data) => {
    return new Promise(async (resolve, reject) => {
        console.log(data)
        try {
            if (!data.name || !data.image || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    message: "Missing parameter",
                });
            } else {
                await db.Handbook.create({
                    name:data.name,
                    image: data.image,
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
let getAllHandbook = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let data = await db.Handbook.findAll();
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
let getDetailHandbookById = (inputId) => {
    return new Promise(async(resolve, reject) => {
        try {
              if (!inputId) {
                resolve({
                    errCode: 1,
                    message: "Missing parameter",
                });
              } else {
                    let  data = await db.Handbook.findOne({
                      where: {
                          id:inputId
                        },
                    //   attributes:['image','name','descriptionHTML','descriptionMarkdown']
                    })
                //   console.log(data.image)
                       data.image=new Buffer(data.image, 'base64').toString('binary');

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
let deleteHandbook = (id) => {
  return new Promise(async (resolve, reject) => {
    let handbook = await db.Handbook.findOne({
      where: { id: id },
    });
    if (!handbook) {
      resolve({
        errCode: 1,
        message: "handbook not exist",
      });
    }

    await db.Handbook.destroy({
      where: { id: id },
    });

    resolve({
      errCode: 0,
      message: "Delete handbook success",
    });
  });
};
let updateHandbookData = (data) => {
  return new Promise(async (resolve, reject) => {
    // console.log('check data update',data.id)
    try {
      if (!data.id || !data.name || !data.descriptionHTML || !data.descriptionMarkdown) {
        resolve({
          errCode: 2,
          message: "Missing parameter",
        });
      }
      let handbook = await db.Handbook.findOne({
        where: { id: data.id },
        raw: false,
      });
    //  console.log('check',handbook)

      if (handbook) {
        handbook.name = data.name;
        // handbook.image = data.image;
        handbook.descriptionHTML = data.descriptionHTML;
        handbook.descriptionMarkdown = data.descriptionMarkdown;
        if (data.image) {
          handbook.image = data.image;
        }
        await handbook.save();
        resolve({
          errCode: 0,
          message: "Update handbook success",
        });
      } else {
        resolve({
          errCode: 1,
          message: "handbook not found",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
    createHandbook: createHandbook,
    getAllHandbook: getAllHandbook,
    getDetailHandbookById: getDetailHandbookById,
    deleteHandbook,
    updateHandbookData
}