const contactModel = require("../../models/contact");
const UserModel = require("../../models/user");
const cloudinary = require("cloudinary");
const bcrypt = require("bcrypt");

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
        msg1: req.flash("success"),
      });
    } catch (error) {
      console.log(error);
    }
  };

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
          res.redirect("/admin/update_pass");
        } else {
          if (np != cp) {
            req.flash("error", "Password does not match");
            res.redirect("/admin/update_pass");
          } else {
            const newHashPassword = await bcrypt.hash(np, 10);
            await UserModel.findByIdAndUpdate(id, {
              password: newHashPassword,
            });
            req.flash("success", "Password Updated by Admin successfully ");
            res.redirect("/admin/update_pass");
          }
        }
      } else {
        req.flash("error", "ALL fields are required ");
        res.redirect("/admin/update_pass");
      }
    } catch (error) {
      console.log(error);
    }
  };

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
      req.flash("success", "Profile Update by Admin successfully");
      res.redirect("/admin/profile_update");
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = AdminController;
