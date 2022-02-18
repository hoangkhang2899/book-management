const express = require("express");
const router = express.Router();
const dbHandler = require("../databaseHandler");

// Middleware
router.use((req, res, next) => {
  if (req.session.user == null) {
    res.redirect("/login");
  } else {
    if (req.session.user.role == "Customer") {
      next();
    } else {
      res.redirect("/admin");
    }
  }
});

router.get("/", async (req, res) => {
  const result = await dbHandler.getAll("Feedback");
  const arr = [];
  result.forEach((e) => {
    if (req.query.name === e.name) {
      arr.push(e);
    }
  });
  res.render("feedback", { query: req.query.name, list: arr }); //lay id cua sach truyen vao form
});
router.post("/", (req, res) => {
  const obj = {
    ...req.body, //copy all element of req.body
    username: req.session.user.name,
    time: new Date().toISOString(),
  };
  dbHandler.insertObject("Feedback", obj);
  res.redirect("/");
});

module.exports = router;
