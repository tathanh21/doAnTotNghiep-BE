import handbookService from "../services/handbookService";
let createHandbook = async(req, res) => {
       try {
       let info = await handbookService.createHandbook(req.body);
       return res.status(200).json(info);
       } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error code from server ....",
    });
  }
}
let getAllHandbook = async (req, res) => {
     try {
       let info = await handbookService.getAllHandbook();
       return res.status(200).json(info);
       } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error code from server ....",
    });
  }
}
let getDetailHandbookById = async (req, res) => {
   try {
       let info = await handbookService.getDetailHandbookById(req.query.id);
       return res.status(200).json(info);
       } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error code from server ....",
    });
  }
}

let handleDeleteHandbook = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing input parameter",
    });
  }
  let message = await handbookService.deleteHandbook(req.body.id);
  return res.status(200).json({
    errCode: message.errCode,
    errMessage: message.message,
  });
};
let handleEditHandbook = async (req, res) => {
  let data = req.body;
  let message = await handbookService.updateHandbookData(data);
  return res.status(200).json({
    errCode: message.errCode,
    errMessage: message.message,
  });
};
module.exports = {
    createHandbook: createHandbook,
  getAllHandbook: getAllHandbook,
    getDetailHandbookById: getDetailHandbookById,
    handleDeleteHandbook,
    handleEditHandbook
}