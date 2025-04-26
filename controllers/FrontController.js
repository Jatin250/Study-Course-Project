const UserModel = require("../models/user");
const ContactModel = require("../models/contact");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");
const CourseModel = require("../models/course");

// configuration Setup
cloudinary.config({
  cloud_name: "dkpr89ars",
  api_key: "525114599641279",
  api_secret: "T96YdvUrKMsDhb1vxfsux2sbftA",
});

class FrontController {
  static home = async (req, res) => {
    try {
      const { token } = req.cookies;
      let pageTitle = "Home";
      if (!token) {
        const course = await CourseModel.find();
        res.render("home", {
          pageTitle: pageTitle,
          token: token,
          c: course,
          msg: req.flash("success"),
          msg1: req.flash("error"),
        });
      } else {
        res.redirect("/Home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static home1 = async (req, res) => {
    try {
      const { token } = req.cookies;
      const { name, image } = req.udata;
      const course = await CourseModel.find();
      let pageTitle = "Home";
      res.render("home", {
        pageTitle: pageTitle,
        n: name,
        i: image,
        token: token,
        c: course,
        msg: req.flash("success"),
        msg1: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static about = async (req, res) => {
    try {
      const { token } = req.cookies;
      let pageTitle = "About";
      if (!token) {
        const course = await CourseModel.find();
        res.render("about", {
          pageTitle: pageTitle,
          token: token,
          c: course,
          msg: req.flash("success"),
          msg1: req.flash("error"),
        });
      } else {
        res.redirect("/aboutPage");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static about1 = async (req, res) => {
    try {
      const { token } = req.cookies;
      const { name, image } = req.udata;
      const course = await CourseModel.find();
      let pageTitle = "About";
      res.render("about", {
        pageTitle: pageTitle,
        n: name,
        i: image,
        token: token,
        c: course,
        msg: req.flash("success"),
        msg1: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static course = async (req, res) => {
    try {
      const { token } = req.cookies;
      let pageTitle = "Course";
      if (!token) {
        const course = await CourseModel.find();
        res.render("course", {
          pageTitle: pageTitle,
          token: token,
          c: course,
          msg: req.flash("success"),
          msg1: req.flash("error"),
        });
      } else {
        res.redirect("/coursePage");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static course1 = async (req, res) => {
    try {
      const { token } = req.cookies;
      const { name, image } = req.udata;
      const course = await CourseModel.find();
      let pageTitle = "Course";
      res.render("course", {
        pageTitle: pageTitle,
        n: name,
        i: image,
        token: token,
        c: course,
        msg: req.flash("success"),
        msg1: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static contact = async (req, res) => {
    try {
      const { token } = req.cookies;
      let pageTitle = "Contact";
      if (!token) {
        const course = await CourseModel.find();
        res.render("contact", {
          pageTitle: pageTitle,
          token: token,
          c: course,
          msg: req.flash("success"),
          msg1: req.flash("error"),
        });
      } else {
        res.redirect("/contactPage");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static contact1 = async (req, res) => {
    try {
      const { token } = req.cookies;
      const { name, image } = req.udata;
      const course = await CourseModel.find();
      let pageTitle = "Contact";
      res.render("contact", {
        pageTitle: pageTitle,
        n: name,
        i: image,
        token: token,
        c: course,
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
        return res.redirect("/contact");
      }

      await ContactModel.create({
        name,
        email,
        phone,
        message,
      });
      req.flash("success", "Submitted Successfully !");
      res.redirect("/contact");
    } catch (error) {
      console.log(error);
    }
  };

  // courseDetails
  static courseDetails = async (req, res) => {
    try {
      const { token } = req.cookies;
      const id = req.params.id;
      let pageTitle = "Course Details";
      if (!token) {
        const course = await CourseModel.findById(id);
        res.render("course/courseDetails", {
          pageTitle: pageTitle,
          token: token,
          c: course,
        });
      } else {
        const id = req.params.id;
        res.redirect(`/courseDetail/${id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  static courseDetails1 = async (req, res) => {
    try {
      const { token } = req.cookies;
      const { name, image } = req.udata;
      const id = req.params.id;
      const course = await CourseModel.findById(id);
      let pageTitle = "Contact";
      res.render("course/courseDetails", {
        pageTitle: pageTitle,
        n: name,
        i: image,
        token: token,
        c: course,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // profile
  static profile = async (req, res) => {
    try {
      const { token } = req.cookies;
      const { name, image, email } = req.udata;
      const course = await CourseModel.find();
      let pageTitle = "Profile";
      res.render("profile", {
        pageTitle: pageTitle,
        n: name,
        i: image,
        e: email,
        token: token,
        c: course,
        msg: req.flash("success"),
        msg1: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  // changePassword
  static changePassword = async (req, res) => {
    try {
      const { id } = req.udata;
      // console.log(req.body);
      const { op, np, cp } = req.body;
      if (op && np && cp) {
        const user = await UserModel.findById(id);
        const isMatched = await bcrypt.compare(op, user.password);
        //console.log(isMatched)
        if (!isMatched) {
          req.flash("error", "Current password is incorrect ");
          res.redirect("/profile");
        } else {
          if (np != cp) {
            req.flash("error", "Password does not match");
            res.redirect("/profile");
          } else {
            const newHashPassword = await bcrypt.hash(np, 10);
            await UserModel.findByIdAndUpdate(id, {
              password: newHashPassword,
            });
            req.flash("success", "Password Updated successfully ");
            res.redirect("/login");
          }
        }
      } else {
        req.flash("error", "ALL fields are required ");
        res.redirect("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // updateProfile
  static updateProfile = async (req, res) => {
    try {
      const { id } = req.udata;
      const { name, email } = req.body;
      if (req.files) {
        const user = await UserModel.findById(id);
        const imageID = user.image.public_id;
        // console.log(imageID);

        //deleting image from Cloudinary
        await cloudinary.uploader.destroy(imageID);
        //new image update
        const imagefile = req.files.image;
        const imageupload = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "userprofile",
          }
        );
        var data = {
          name: name,
          email: email,
          image: {
            public_id: imageupload.public_id,
            url: imageupload.secure_url,
          },
        };
      } else {
        var data = {
          name: name,
          email: email,
        };
      }
      await UserModel.findByIdAndUpdate(id, data);
      req.flash("success", "Update Profile successfully");
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  // logout
  static logout = async (req, res) => {
    try {
      const course = await CourseModel.find();
      let pageTitle = "Login";
      res.render("login", {
        pageTitle: pageTitle,
        c: course,
        msg: req.flash("success"),
        msg1: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = FrontController;
