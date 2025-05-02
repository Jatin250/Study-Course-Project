const contactModel = require("../models/contact");
const UserModel = require("../models/user");
const cloudinary = require("cloudinary");
const bcrypt = require("bcrypt");
const CourseModel = require("../models/course");
const LectureModel = require("../models/lecture");

// configuration Setup
cloudinary.config({
  cloud_name: "dkpr89ars",
  api_key: "525114599641279",
  api_secret: "T96YdvUrKMsDhb1vxfsux2sbftA",
});

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
      const course = await CourseModel.find();
      res.render("admin/allCourses", {
        n: name,
        i: image,
        e: email,
        c: course,
        msg: req.flash("error"),
        msg1: req.flash("success"),
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

  static addNewCourse = async (req, res) => {
    try {
      // console.log(req.body);
      const {
        courseName,
        courseImage,
        courseOverview,
        courseRequirement,
        courseCurriculum,
        coursePrize,
        numOfLesson,
        courseDuration,
        courseLevel,
        teacherName,
        teacherDesignation,
        teacherAbout,
        teacherImage,
        expYear,
        whatYouWillLearn1,
        whatYouWillLearn2,
        whatYouWillLearn3,
      } = req.body;

      // image UpLoad
      // console.log(req.files.courseImage);
      const file1 = req.files.courseImage;
      const imageUpload1 = await cloudinary.uploader.upload(
        file1.tempFilePath,
        {
          folder: "userprofile",
        }
      );
      // console.log(imageUpload1);

      // console.log(req.files.teacherImage);
      const file2 = req.files.teacherImage;
      const imageUpload2 = await cloudinary.uploader.upload(
        file2.tempFilePath,
        {
          folder: "userprofile",
        }
      );
      // console.log(imageUpload2);

      const data = await CourseModel.create({
        courseName,
        courseImage: {
          public_id_1: imageUpload1.public_id,
          url_1: imageUpload1.secure_url,
        },
        courseOverview,
        courseRequirement,
        courseCurriculum,
        coursePrize,
        numOfLesson,
        courseDuration,
        courseLevel,
        teacherName,
        teacherDesignation,
        teacherAbout,
        teacherImage: {
          public_id_2: imageUpload2.public_id,
          url_2: imageUpload2.secure_url,
        },
        expYear,
        whatYouWillLearn1,
        whatYouWillLearn2,
        whatYouWillLearn3,
      });
      if (data) {
        req.flash("success", "Course Register Successfully..!!");
        res.redirect("/admin/addCourse");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static viewCourse = async (req, res) => {
    try {
      const { name, image, email } = req.udata;
      const id = req.params.id;
      // console.log(id)
      const course = await CourseModel.findById(id);
      // console.log(course)
      res.render("admin/viewCourse", {
        n: name,
        i: image,
        e: email,
        c: course,
        msg: req.flash("error"),
        msg1: req.flash("success"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static editCourse = async (req, res) => {
    try {
      const { name, image, email } = req.udata;
      const id = req.params.id;
      // console.log(id)
      const course = await CourseModel.findById(id);
      // console.log(course)
      res.render("admin/editCourse", {
        n: name,
        i: image,
        e: email,
        c: course,
        msg: req.flash("error"),
        msg1: req.flash("success"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static deleteCourse = async (req, res) => {
    try {
      const { name, image, email } = req.udata;
      const id = req.params.id;
      // console.log(id)
      const course = await CourseModel.findByIdAndDelete(id);
      // console.log(course)
      res.redirect("/admin/allCourses");
    } catch (error) {
      console.log(error);
    }
  };

  static update_course = async (req, res) => {
    try {
      const id = req.params.id;
      // console.log(req.body);
      const {
        courseName,
        courseImage,
        courseOverview,
        courseRequirement,
        courseCurriculum,
        coursePrize,
        numOfLesson,
        courseDuration,
        courseLevel,
        teacherName,
        teacherDesignation,
        teacherAbout,
        teacherImage,
        expYear,
        whatYouWillLearn1,
        whatYouWillLearn2,
        whatYouWillLearn3,
      } = req.body;

      if (req.files) {
        // for both images change
        if (req.files.courseImage && req.files.teacherImage) {
          // console.log("test-1");
          const course = await CourseModel.findById(id);
          const courseImageID = course.courseImage.public_id_1;
          const teacherImageID = course.teacherImage.public_id_2;

          //deleting image from Cloudinary
          await cloudinary.uploader.destroy(courseImageID);
          await cloudinary.uploader.destroy(teacherImageID);
          //new image update
          const imagefile1 = req.files.courseImage;
          const imagefile2 = req.files.teacherImage;
          const imageUpload1 = await cloudinary.uploader.upload(
            imagefile1.tempFilePath,
            {
              folder: "userprofile",
            }
          );
          const imageUpload2 = await cloudinary.uploader.upload(
            imagefile2.tempFilePath,
            {
              folder: "userprofile",
            }
          );
          var data = {
            courseName,
            courseImage: {
              public_id_1: imageUpload1.public_id,
              url_1: imageUpload1.secure_url,
            },
            courseOverview,
            courseRequirement,
            courseCurriculum,
            coursePrize,
            numOfLesson,
            courseDuration,
            courseLevel,
            teacherName,
            teacherDesignation,
            teacherAbout,
            teacherImage: {
              public_id_2: imageUpload2.public_id,
              url_2: imageUpload2.secure_url,
            },
            expYear,
            whatYouWillLearn1,
            whatYouWillLearn2,
            whatYouWillLearn3,
          };
        } else if (req.files.courseImage) {
          // console.log("test-1");
          const course = await CourseModel.findById(id);
          // console.log(course);
          const courseImageID = course.courseImage.public_id_1;
          // console.log(courseImageID);

          //deleting image from Cloudinary
          await cloudinary.uploader.destroy(courseImageID);
          //new image update
          const imagefile = req.files.courseImage;
          const imageUpload = await cloudinary.uploader.upload(
            imagefile.tempFilePath,
            {
              folder: "userprofile",
            }
          );
          var data = {
            courseName,
            courseImage: {
              public_id_1: imageUpload.public_id,
              url_1: imageUpload.secure_url,
            },
            courseOverview,
            courseRequirement,
            courseCurriculum,
            coursePrize,
            numOfLesson,
            courseDuration,
            courseLevel,
            teacherName,
            teacherDesignation,
            teacherAbout,
            expYear,
            whatYouWillLearn1,
            whatYouWillLearn2,
            whatYouWillLearn3,
          };
        } else {
          // console.log("test-2");
          const course = await CourseModel.findById(id);
          // console.log(course);
          const teacherImageID = course.teacherImage.public_id_2;
          // console.log(teacherImageID);

          //deleting image from Cloudinary
          await cloudinary.uploader.destroy(teacherImageID);
          //new image update
          const imagefile = req.files.teacherImage;
          const imageUpload = await cloudinary.uploader.upload(
            imagefile.tempFilePath,
            {
              folder: "userprofile",
            }
          );
          var data = {
            courseName,
            courseOverview,
            courseRequirement,
            courseCurriculum,
            coursePrize,
            numOfLesson,
            courseDuration,
            courseLevel,
            teacherName,
            teacherDesignation,
            teacherAbout,
            teacherImage: {
              public_id_2: imageUpload.public_id,
              url_2: imageUpload.secure_url,
            },
            expYear,
            whatYouWillLearn1,
            whatYouWillLearn2,
            whatYouWillLearn3,
          };
        }
      } else {
        // console.log("test-3");
        var data = {
          courseName,
          courseOverview,
          courseRequirement,
          courseCurriculum,
          coursePrize,
          numOfLesson,
          courseDuration,
          courseLevel,
          teacherName,
          teacherDesignation,
          teacherAbout,
          expYear,
          whatYouWillLearn1,
          whatYouWillLearn2,
          whatYouWillLearn3,
        };
      }

      await CourseModel.findByIdAndUpdate(id, data);
      req.flash("success", "Course updated successfully by Admin.");
      res.redirect("/admin/allCourses");
    } catch (error) {
      console.log(error);
    }
  };

  static addLecture = async (req, res) => {
    try {
      const { name, image, email } = req.udata;
      res.render("admin/addLecture", {
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

  static addNewLecture = async (req, res) => {
    try {
      // console.log(req.body);
      const { lectureTitle, lectureIsFree } = req.body;

      // video UpLoad
      // console.log(req.files.lectureVideo);
      const file = req.files.lectureVideo;
      const videoUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "userprofile",
      });
      // console.log(videoUpload)

      const data = await LectureModel.create({
        lectureTitle,
        lectureVideo: {
          public_id: videoUpload.public_id,
          url: videoUpload.secure_url,
        },
        lectureIsFree,
      });
      if (data) {
        req.flash("success", "Lecture Added");
        res.redirect("/admin/allCourses");
      } else {
        req.flash("error", "not found");
        req.redirect("/admin/allCourses");
      }
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = AdminController;
