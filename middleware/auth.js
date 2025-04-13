const userModel = require("../models/user");
const jwt = require("jsonwebtoken");

const checkAuth = async (req, res, next) => {
  // console.log("checkAuth");
  const { token } = req.cookies;
  // console.log(token);
  if (!token) {
    req.flash("error", "Unathorised user please login");
    res.redirect("/login");
  } else {
    const verifyToken = jwt.verify(token, "sdjhdjwcdsk");
    // console.log(verifyToken)
    const data = await userModel.findOne({ _id: verifyToken.ID });
    // console.log(data)
    req.udata = data;
    next();
  }
};
module.exports = checkAuth;
