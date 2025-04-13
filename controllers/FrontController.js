const UserModel = require("../models/user");
const ContactModel = require("../models/contact");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");

// configuration Setup
cloudinary.config({
  cloud_name: "dkpr89ars",
  api_key: "525114599641279",
  api_secret: "T96YdvUrKMsDhb1vxfsux2sbftA",
});

class FrontController {
  static home = async (req, res) => {
    try {
      res.render("home", {
        msg: req.flash("success"),
        msg1: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static login = async (req, res) => {
    try {
      res.render("login", {
        msg: req.flash("success"),
        msg1: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static register = async (req, res) => {
    try {
      res.render("register", {
        msg: req.flash("success"),
        msg1: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  // registerUser
  static registerUser = async (req, res) => {
    try {
      // console.log(req.body);
      const { name, email, password, confirmPassword } = req.body;

      if (!name || !email || !password || !confirmPassword) {
        req.flash("error", "All fields are Required.");
        return res.redirect("/register");
      }
      const isEmail = await UserModel.findOne({ email });
      if (isEmail) {
        req.flash("error", "Email Already Exists.");
        return res.redirect("/register");
      }
      if (password != confirmPassword) {
        req.flash("error", "Password does not match.");
        return res.redirect("/register");
      }

      // image UpLoad
      // console.log(req.files.image);
      const file = req.files.image;
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "userprofile",
      });
      // console.log(imageUpload)

      // bcrypt Password
      const hashpassword = await bcrypt.hash(password, 10);

      const data = await UserModel.create({
        name,
        email,
        password: hashpassword,
        image: {
          public_id: imageUpload.public_id,
          url: imageUpload.secure_url,
        },
      });
      if (data) {
        req.flash("success", "Your Register Success, Plz Login");
        res.redirect("/login");
      } else {
        req.flash("error", "not found");
        req.redirect("/register");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // userLogin
  static userLogin = async (req, res) => {
    try {
      // console.log(req.body);
      const { email, password } = req.body;
      if (email && password) {
        const user = await UserModel.findOne({ email: email });
        if (user != null) {
          const isMatched = await bcrypt.compare(password, user.password);
          //  console.log(isMatched)
          if (isMatched) {
            if (user.role == "admin") {
              //token create
              var jwt = require("jsonwebtoken");
              let token = jwt.sign({ ID: user.id }, "sdjhdjwcdsk");
              // console.log(token);
              res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                maxAge: 3600000, // Expires in 1 hrs
              });
              res.redirect("/admin/dashboard");
            } else if (user.role == "student") {
              //token create
              var jwt = require("jsonwebtoken");
              let token = jwt.sign({ ID: user.id }, "sdjhdjwcdsk");
              //console.log(token)
              res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                maxAge: 3600000, // Expires in 1 hrs
              });
              if (req.session) {
                req.session.destroy((err) => {
                  if (err) {
                    console.error("Error destroying session:", err);
                  }
                });
              }
              res.redirect("/");
            } else {
              req.flash("error", "Please verify your Email.");
              return res.redirect("/");
            }
          } else {
            req.flash("error", "Email and Password is not correct.");
            return res.redirect("/login");
          }
        } else {
          req.flash("error", "you are not a register user.");
          return res.redirect("/login");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // contactByUser
  static contactByUser = async (req, res) => {
    try {
      // console.log(req.body);
      const { name, email, phone, message } = req.body;

      if (!name || !email || !phone || !message) {
        req.flash("error", "All fields are Required.");
        return res.redirect("/");
      }

      await ContactModel.create({
        name,
        email,
        phone,
        message,
      });
      req.flash("success", "Submitted Successfully !");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };

  // courseDetails
  static courseDetails = async (req, res) => {
    try {
      const { id, name, image } = req.udata;
      await UserModel.find({ user_id: id });
      // console.log(course);
      res.render("course/courseDetails", {
        n: name,
        i: image,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // profile
  static profile = async (req, res) => {
    try {
      const { name, image, email } = req.udata;
      res.render("profile", {
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

  // logout
  static logout = async (req, res) => {
    try {
      res.render("home", {
        msg: req.flash("success"),
        msg1: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = FrontController;
