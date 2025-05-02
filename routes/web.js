const express = require("express");
const FrontController = require("../controllers/FrontController");
const AdminController = require("../controllers/AdminController");
const route = express.Router();
const checkAuth = require("../middleware/auth");
const adminRole = require("../middleware/adminRole");

route.get("/", FrontController.home);
route.get("/about", FrontController.about);
route.get("/course", FrontController.course);
route.get("/contact", FrontController.contact);
route.get("/login", FrontController.login);
route.get("/register", FrontController.register);

// Register and Login
route.post("/registerUser", FrontController.registerUser);
route.post("/userLogin", FrontController.userLogin);

// contactByUser
route.post("/contactByUser", checkAuth, FrontController.contactByUser);

// courseDetails
route.get("/courseDetails/:id", FrontController.courseDetails);

// profile
route.get("/profile", checkAuth, FrontController.profile);
route.post("/updateProfile", checkAuth, FrontController.updateProfile);
route.post("/changePassword", checkAuth, FrontController.changePassword);

// myLearning
route.get("/myLearning", checkAuth, FrontController.myLearning);

// logout
route.get("/logout", FrontController.logout);

// admin
route.get(
  "/admin/dashboard",
  checkAuth,
  adminRole("admin"),
  AdminController.dashboard
);
route.get(
  "/admin/contactDisplay",
  checkAuth,
  adminRole("admin"),
  AdminController.contactDisplay
);
route.get(
  "/admin/allCourses",
  checkAuth,
  adminRole("admin"),
  AdminController.allCourses
);
route.get(
  "/admin/addCourse",
  checkAuth,
  adminRole("admin"),
  AdminController.addCourse
);
route.get(
  "/admin/update_pass",
  checkAuth,
  adminRole("admin"),
  AdminController.update_pass
);
route.get(
  "/admin/profile_update",
  checkAuth,
  adminRole("admin"),
  AdminController.profile_update
);
route.post(
  "/admin/changePassword",
  checkAuth,
  adminRole("admin"),
  AdminController.changePassword
);
route.post(
  "/admin/updateProfile",
  checkAuth,
  adminRole("admin"),
  AdminController.updateProfile
);
route.post(
  "/admin/addNewCourse",
  checkAuth,
  adminRole("admin"),
  AdminController.addNewCourse
);
route.get(
  "/admin/viewCourse/:id",
  checkAuth,
  adminRole("admin"),
  AdminController.viewCourse
);
route.get(
  "/admin/editCourse/:id",
  checkAuth,
  adminRole("admin"),
  AdminController.editCourse
);
route.get(
  "/admin/deleteCourse/:id",
  checkAuth,
  adminRole("admin"),
  AdminController.deleteCourse
);
route.post(
  "/admin/update_Course/:id",
  checkAuth,
  adminRole("admin"),
  AdminController.update_course
);

// Lectures

route.get(
  "/admin/addLecture/:id",
  checkAuth,
  adminRole("admin"),
  AdminController.addLecture
);
route.post(
  "/admin/addNewLecture",
  checkAuth,
  adminRole("admin"),
  AdminController.addNewLecture
);

module.exports = route;
