const express = require("express");
const app = express();
const port = 3000;
const web = require("./routes/web");
const connectDB = require("./database/connectDB");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

// get token from cookie
app.use(cookieParser());

// image upload
app.use(fileUpload({ useTempFiles: true }));

// connect-flash and express-session
const session = require("express-session");
const flash = require("connect-flash");

//message
app.use(
  session({
    secret: "secret",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);
//flash message
app.use(flash());

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// css image public
app.use(express.static("public"));

// database connect
connectDB();

// ejs set
app.set("view engine", "ejs");

// routing
app.use("/", web);
// server start
app.listen(port, () => {
  console.log(`start localhost: ${port}`);
});
