const contactModel = require("../../models/contact");

class AdminController {
  static dashboard = async (req, res) => {
    try {
      const { name, image, email } = req.udata;
      res.render("admin/dashboard", {
        n: name,
        i: image,
        e: email,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static contactDisplay = async (req, res) => {
    try {
      const { name, image, email } = req.udata;
      const contact = await contactModel.find();
      res.render("admin/contactDisplay", {
        n: name,
        i: image,
        e: email,
        c: contact,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Courses
  static allCourses = async (req, res) => {
    try {
      const { name, image, email } = req.udata;
      res.render("admin/allCourses", {
        n: name,
        i: image,
        e: email,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // addCourse
  static addCourse = async (req, res) => {
    try {
      const { name, image, email } = req.udata;
      res.render("admin/addCourse", {
        n: name,
        i: image,
        e: email,
        msg: req.flash("error"),
        msg1: req.flash("success"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static update_pass = async (req, res) => {
    try {
      const { name, image, email } = req.udata;
      res.render("admin/updatePass", {
        n: name,
        i: image,
        e: email,
        msg: req.flash("error"),
        msg1: req.flash("success"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static profile_update = async (req, res) => {
    try {
      const { name, image, email } = req.udata;
      res.render("admin/profileUpdate", {
        n: name,
        i: image,
        e: email,
        msg: req.flash("error"),
        msg1: req.flash("success"),
      });
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = AdminController;
