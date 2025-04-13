const express = require("express");
const FrontController = require("../controllers/FrontController");
const AdminController = require("../controllers/admin/AdminController");
const route = express.Router();
const checkAuth = require("../middleware/auth");

route.get("/", FrontController.home);
route.get("/login", FrontController.login);
route.get("/register", FrontController.register);

route.post("/registerUser", FrontController.registerUser);
route.post("/userLogin", FrontController.userLogin);

// contactByUser
route.post("/contactByUser", checkAuth, FrontController.contactByUser);

// courseDetails
route.get("/courseDetails", checkAuth, FrontController.courseDetails);

// profile
route.get("/profile", checkAuth, FrontController.profile);

// logout
route.get("/logout", FrontController.logout);

// admin
route.get("/admin/dashboard", checkAuth, AdminController.dashboard);
route.get("/admin/contactDisplay", checkAuth, AdminController.contactDisplay);
route.get("/admin/allCourses", checkAuth, AdminController.allCourses);
route.get("/admin/addCourse", checkAuth, AdminController.addCourse);
route.get("/admin/update_pass", checkAuth, AdminController.update_pass);
route.get("/admin/profile_update", checkAuth, AdminController.profile_update);

module.exports = route;
