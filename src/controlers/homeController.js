import CRUDService from "../services/CRUDService";
let getHomeController = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render("homepage.ejs");
  } catch (error) {}
};

let getCRUD = async (req, res) => {
  return res.render("crud.ejs");
};
let postCRUD = async (req, res) => {
  let message = await CRUDService.createNewUser(req.body);
  return res.send("anb");
};
let displayGetCRUD = async (req, res) => {
  let data = await CRUDService.getAllUser();
  return res.render("displayCrud.ejs", { dataTable: data });
};

let getEditCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let data = await CRUDService.getEditCRUD(userId);
    res.render("editCRUD.ejs", { dataUser: data });
  } else {
    res.send("not found");
  }
};

let putCRUD = async (req, res) => {
  let data = req.body;
  let allUser = await CRUDService.updateUserData(data);
  return res.render("displayCrud.ejs", { dataTable: allUser });
};
let deleteCRUD = async (req, res) => {
  let id = req.query.id;
  let allUser = await CRUDService.deleteUserById(id);
  return res.render("displayCrud.ejs", { dataTable: allUser });
};

let getAllBooking = async (req, res) => {
     try {
       let data = await CRUDService.getAllBooking();
       return res.status(200).json(data);
       } catch (error) {
    return res.status(200).json({
      errCode: -1,
      message: "Error code from server ....",
    });
  }
}

module.exports = {
  getHomeController: getHomeController,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCRUD: displayGetCRUD,
  getEditCRUD: getEditCRUD,
  putCRUD: putCRUD,
  deleteCRUD: deleteCRUD,
  getAllBooking:getAllBooking
};
