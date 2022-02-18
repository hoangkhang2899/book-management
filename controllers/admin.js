const express = require("express");
const { insertObject, getAll, deleteDocumentById, getDocumentById, updateDocument } = require("../databaseHandler");
const router = express.Router();
const dbHandler = require("../databaseHandler");
const { ObjectId } = require("mongodb");
router.use(express.static("public"));

//middleware
// router.use((req, res, next) => {
//   const { user } = req.session; //same as: user = req.session.user
//   if (user) {
//     if (user.role == "admin") {
//       next("route");
//     } else {
//       res.sendStatus(404);
//     }
//   } else {
//     res.redirect("/login");
//   }
// });

//neu request la: /admin
router.get("/", async (req, res) => {
  if (req.query.sortBy == "today") {
    res.redirect("/admin/today");
  } else if (req.query.sortBy == "week") {
    res.redirect("/admin/week");
  } else {
    const customerOrder = await dbHandler.getAll("Customer Order");
    customerOrder.forEach((element) => (element.time = element.time.toLocaleString("vi")));
    res.render("adminPage", {
      customerOrder: customerOrder,
      user: req.session.user,
    });
  }
});

//neu request la: /admin/addUser
router.get("/addUser", (req, res) => {
  res.send("This is add user page!");
  // res.render('addUser')
});

router.get("/feedbackManage", async (req, res) => {
  const result = await dbHandler.getAllFeedback();
  // res.render("feedbackManagement", { result });
  res.render("adminPage", { feedback: result, user: req.session.user });
});
router.get("/feedbackManage/delete", async (req, res) => {
  console.log(req.query);
  await dbHandler.deleteDocumentById("Feedback", req.query.id);
  res.redirect("/admin/feedbackManage");
});
router.get("/feedbackManage/:day", async (req, res, next) => {
  let result = await dbHandler.getAllFeedback();
  const today = new Date();
  if (req.params.day === "today") {
    result = result.filter((e) => new Date(e.time).toDateString() === today.toDateString());
    res.render("adminPage", {
      feedback: result,
      user: req.session.user,
    });
  } else if (req.params.day === "2days") {
    const queryDay = new Date(today.setDate(today.getDate() - 2));
    result = result.filter((e) => new Date(e.time) > queryDay);
    res.render("adminPage", {
      feedback: result,
      user: req.session.user,
    });
  } else if (req.params.day === "2weeks") {
    const queryDay = new Date(today.setDate(today.getDate() - 14));
    result = result.filter((e) => new Date(e.time) > queryDay);
    res.render("adminPage", {
      feedback: result,
      user: req.session.user,
    });
  } else if (req.params.day === "2months") {
    const queryDay = new Date(today.setMonth(today.getMonth() - 2));
    result = result.filter((e) => new Date(e.time) > queryDay);
    res.render("adminPage", {
      feedback: result,
      user: req.session.user,
    });
  } else {
    next("route");
  }
});
router.get("/feedbackManage/specifyDay/:day", async (req, res) => {
  let result = await dbHandler.getAllFeedback();
  const specifyDay = new Date(req.params.day).toDateString();
  result = result.filter((e) => new Date(e.time).toDateString() === specifyDay);
  res.render("adminPage", { feedback: result, user: req.session.user });
});

//Submit add User
router.post("/addUser", (req, res) => {
  const name = req.body.txtName;
  const role = req.body.Role;
  const pass = req.body.txtPassword;
  const objectToInsert = {
    userName: name,
    role: role,
    password: pass,
  };
  insertObject("Users", objectToInsert);
  res.render("adminIndex");
});

router.get("/customer", (req, res) => {
  res.render("Admin_Customer");
});

router.get("/product", (req, res) => {
  res.render("Admin_Product");
});

// router.get("/admin", async (req, res) => {
//     let result = await dbHandler.getAll("Customer Order");
//     result.forEach((element) => (element.time = element.time.toLocaleString("vi")));
//     res.render("adminPage", { demo: result, next: true });
// });

router.get("/:sortBy", async (req, res) => {
  let result = await dbHandler.getAll("Customer Order");
  if (req.params.sortBy === "today") {
    let today = new Date().toLocaleDateString("vi");
    result = result.filter((item) => {
      return item.time.toLocaleDateString("vi") === today;
    });
    result.forEach((element) => {
      element.time = element.time.toLocaleString("vi");
    });
    res.render("adminPage", { customerOrder: result, search: true });
  } else if (req.params.sortBy === "week") {
    let today = new Date();
    let week = new Date(today.setDate(today.getDate() - 7));
    result = result.filter((item) => item.time > week);
    result.forEach((element) => (element.time = element.time.toLocaleString("vi")));
    res.render("adminPage", { customerOrder: result, search: true });
  } else if (req.params.sortBy === "delete") {
    let { id } = req.query; // same as: let id = req.query.id;
    let result = await dbHandler.deleteOne("Customer Order", {
      _id: ObjectId(id),
    });
    if (result) {
      res.redirect("/admin");
    } else {
      res.send("Cancel error!");
    }
  } else {
    res.redirect("/admin");
  }
});

//view profile
exports.getProfile = async (req, res) => {
  let aTrainee = await trainee.findOne({ email: req.session.email });
  res.render("traineeProfileUpdate", {
    aTrainee: aTrainee,
    loginName: req.session.email,
  });
};

//update profile
exports.updateProfile = async (req, res) => {
  let id = req.body.id;
  let aTrainee = await trainee.findById(id);
  if (req.file) {
    aTrainee.img = req.file.filename;
  }
  aTrainee.dateOfBirth = new Date(req.body.date);
  aTrainee.education = req.body.education;
  aTrainee = await aTrainee.save();
  res.redirect("/trainee");
};

module.exports = router;
