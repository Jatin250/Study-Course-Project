const mongoose = require("mongoose");
const LectureSchema = mongoose.Schema(
  {
    lectureTitle: {
      type: String,
      required: true,
    },
    lectureVideo: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    lectureIsFree: {
      type: String,
      default: "off",
    },
  },
  { timestamps: true }
);
const LectureModel = mongoose.model("lecture", LectureSchema);
module.exports = LectureModel;
