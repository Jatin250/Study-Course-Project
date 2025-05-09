const mongoose = require("mongoose");
// const local_url = "mongodb://localhost:27017/Study-course-project";
const live_url =
  "mongodb+srv://jatinpal25072002:Jatin1234@cluster0.fk1wz.mongodb.net/Study-course-project";

const connectDB = () => {
  return mongoose
    .connect(live_url)
    .then(() => {
      console.log("Connected");
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = connectDB;
