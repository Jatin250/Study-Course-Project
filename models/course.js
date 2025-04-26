const mongoose = require("mongoose");
const CourseSchema = mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    courseImage: {
      public_id_1: {
        type: String,
        required: true,
      },
      url_1: {
        type: String,
        required: true,
      },
    },
    courseOverview: {
      type: String,
      required: true,
    },
    courseRequirement: {
      type: String,
      required: true,
    },
    courseCurriculum: {
      type: String,
      required: true,
    },
    coursePrize: {
      type: String,
      required: true,
    },
    numOfLesson: {
      type: String,
      required: true,
    },
    courseDuration: {
      type: String,
      required: true,
    },
    courseLevel: {
      type: String,
      required: true,
    },
    teacherName: {
      type: String,
      required: true,
    },
    teacherDesignation: {
      type: String,
      required: true,
    },
    teacherAbout: {
      type: String,
      required: true,
    },
    teacherImage: {
      public_id_2: {
        type: String,
        required: true,
      },
      url_2: {
        type: String,
        required: true,
      },
    },
    expYear: {
      type: String,
      required: true,
    },
    whatYouWillLearn1: {
      type: String,
      required: true,
    },
    whatYouWillLearn2: {
      type: String,
      required: true,
    },
    whatYouWillLearn3: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const CourseModel = mongoose.model("course", CourseSchema);
module.exports = CourseModel;
