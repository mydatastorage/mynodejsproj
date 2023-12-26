// Requiring module
const express = require("express");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");

//let http = require("http");
let path = require("path");
const mongoose = require("mongoose");
let bodyParser = require("body-parser");
//const { MongoClient } = require("mongodb");

//let fs = require("fs");
const mongodb = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017/project_database";
//var dbConn = mongodb.MongoClient.connect("mongodb://localhost:27017");

const app = express(); // Creating express object

const PORT = process.env.PORT || 3000; // Setting Port Number

app.use(express.static("public"));
app.use("/images", express.static("images"));
app.use(express.static("views"));

//app.use(express.static(path.join(__dirname, "public")));
//app.use("/images", express.static(path.join(__dirname, "images")));
//app.use(express.static(path.join(__dirname, "views")));

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("html", require("ejs").renderFile);

//-----SESSION AND COOKIE MANAGEMENT---------------------
const session = require("express-session");
const cookieParser = require("cookie-parser");
var userdata = null;
//-------------------------------------------------------

app.get("/proj", (req, res) => {
  if (userdata == null) res.sendFile("/mynodejsproj/public/index.html");
  else res.sendFile(__dirname + "/public/userdashboard.html");
  return;
});
app.get("/admin", (req, res) => {
  if (userdata == null) {
    res.sendFile(__dirname + "/views/adminlogin.html");
  }
});
app.post("/adminlogindata", (req, res) => {
  if (req.body.adminid == "prolot" && req.body.adminpwd == "systems") {
    res.sendFile(__dirname + "/views/admindashboard.html");
    return;
  } else {
    res.sendFile(__dirname + "/views/adminlogin.html");
  }
});
app.get("/loginform", (req, res) => {
  if (userdata != null) res.sendFile(__dirname + "/public/userdashboard.html");
  else res.sendFile("/mynodejsproj/public/login.html");
});

app.get("/signup", (req, res) => {
  if (userdata == null) res.sendFile("/mynodejsproj/public/signup.html");
  else res.sendFile(__dirname + "/views/userdashboard.html");
});

app.get("/updatepwd", (req, res) => {
  //res.sendFile("/mynodejsproj/public/updatepassword.html");
  if (userdata != null) {
    res.render(__dirname + "/public/updatepassword.html", {
      userid: userdata,
    });
  } else {
    res.sendFile("/mynodejsproj/public/login.html");
  }
});

app.get("/logindata", (req, res) => {
  if (userdata == null) {
    res.sendFile(__dirname + "/public/login.html");
    return;
  } else {
    res.sendFile(__dirname + "/public/userdashboard.html");
  }
});

app.get("/allcomplaint", async (req, res) => {
  try {
    //SETTING UP THE DATABASE POINTS
    //userDataId = id_param;
    const url = "mongodb://127.0.0.1:27017/";
    const client = new MongoClient(url);
    await client.connect();
    //console.log("Connected to the database");
    client
      .db("project_database")
      .collection("complaint")
      .find({})
      .toArray()
      .then((result) => {
        res.render(__dirname + "/views/allcomplaints.html", {
          obj_data: result,
        });
      });
  } catch (error) {
    console.error("An error occurred:", error);
    //res.status(500).send("Internal Server Error");
  }
});
app.get("/complaint", (req, res) => {
  if (userdata == null) {
    res.sendFile(__dirname + "/public/index.html");
    return;
  } else {
    res.render(__dirname + "/views/complaint.html", { userid: userdata });
  }
});
//------TO SEE PARTICULAR COMPLAINT ID DATA ---------------
/*
app.get("/:id", async function (req, res) {
  //console.log(req.params.id);
  if (req.params.id == undefined) {
    res.sendFile(__dirname + "/views/admindashboard.html");
    return;
  }
  try {
    //SETTING UP THE DATABASE POINTS
    //userDataId = id_param;
    const url = "mongodb://127.0.0.1:27017/";
    const client = new MongoClient(url);
    await client.connect();
    //console.log("Connected to the database");
    client
      .db("project_database")
      .collection("complaint")
      .find({
        id: req.params.id.split("id=")[1],
      })
      .toArray()
      .then((result) => {
        res.render(__dirname + "/views/allcomplaints.html", {
          obj_data: result,
        });
      });
  } catch (error) {
    console.error("An error occurred:", error);
    //res.status(500).send("Internal Server Error");
  }
});
*/
/*-----------------------------------------------*/
/*
app.get("/:complaintid", async function (req, res) {
  if (req.params.complaintid == undefined) {
    res.sendFile(__dirname + "/views/admindashboard.html");
    return;
  }*/
//console.log("ID:" + req.params.complaintid.split("complaintid=")[1]);
/*if (userdata == null) {
    res.sendFile(__dirname + "/public/index.html");
    return;
  }*/
/*try {
    //SETTING UP THE DATABASE POINTS
    //userDataId = id_param;
    const url = "mongodb://127.0.0.1:27017/";
    const client = new MongoClient(url);
    await client.connect();
    //console.log("Connected to the database");
    client
      .db("project_database")
      .collection("complaint")
      .find({
        complaintid: req.params.complaintid.split("complaintid=")[1],
      })
      .toArray()
      .then((result) => {
        res.render(__dirname + "/views/allcomplaints.html", {
          obj_data: result,
        });
      });
  } catch (error) {
    console.error("An error occurred:", error);
    //res.status(500).send("Internal Server Error");
  }
});
*/
app.get("/myprofile", async (req, res) => {
  if (userdata == null) {
    res.sendFile(__dirname + "/public/index.html");
    return;
  }
  try {
    //SETTING UP THE DATABASE POINTS
    //userDataId = id_param;
    const url = "mongodb://127.0.0.1:27017/";
    const client = new MongoClient(url);
    await client.connect();
    //console.log("Connected to the database");
    client
      .db("project_database")
      .collection("projdatabase")
      .find({ id: userdata })
      .toArray()
      .then((result) => {
        res.render(__dirname + "/views/myprofile.html", {
          obj_data: result,
        });
      });
  } catch (error) {
    console.error("An error occurred:", error);
    //res.status(500).send("Internal Server Error");
  }
});
app.get("/u/logout", (req, res) => {
  console.log("Logout");
  userdata = null;
  //req.session.destroy();
  res.sendFile(__dirname + "/public/login.html");
  return;
});

//----function for checking id present or not in the database---
async function checkID() {
  try {
    //SETTING UP THE DATABASE POINTS
    //userDataId = id_param;
    const url = "mongodb://127.0.0.1:27017/";
    const client = new MongoClient(url);
    await client.connect();
    //console.log("Connected to the database");
    client
      .db("project_database")
      .collection("projdatabase")
      .find({ id: userDataID })
      .toArray()
      .then((result) => {
        return result;
      });
  } catch (error) {
    console.error("An error occurred:", error);
    //res.status(500).send("Internal Server Error");
  }
}
/* ------------------- */

/*app.post("/signupdata", async function (req, res, next) {
  try {
    //console.log(req.body);
    const data = {
      id: req.body.id,
      pwd: req.body.pwd,
      uname: req.body.uname,
      mob: req.body.mob,
      email: req.body.email,
    };
    userDataID = data.id;
     const usrdata = async () => {
      const usrdat = checkID().then((result) => {
        console.log(result);
      });
      console.log(usrdat);
    };*/
//const response = await checkID();
//console.log("Data:" + response);

//console.log("Kya return aaya hai: " + ret);
/* const url = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(url);

    await client.connect();

    //-----------------------------
    if (data.pwd != req.body.reloginpwd) {
      //res.sendFile("/mynodejsproj/public/error.html");
      res.render(__dirname + "/views/error.html", {
        errorData: "Password & Retype Password Not Matched...!!",
      });
      return;
    }
    //-----------------------------
    console.log("Connected to the database : " + data.id);
    // delete req.body._id;
    client
      .db("project_database")
      .collection("projdatabase")
      .find({ id: data.id })
      .toArray()
      .then((result) => {
        if (Object.keys(result).length > 0) {
          console.log(result);
          //res.status(500).send("Internal Server Error");
          res.render(__dirname + "/views/error.html", {
            errorData: "USER ID ALREADY PRESENT",
          });
          //return;
        } else {
          client
            .db("project_database")
            .collection("projdatabase")
            .insertOne(data);
          //.insertOne(req.body);

          //res.send("User Registered...!!" + "<br>" + JSON.stringify(req.body));
          //res.sendFile("/mynodejsproj/public/success.html");
          res.render(__dirname + "/public/success.html", {
            successData: "Data Saved Successfully...!",
          });
        }
      });*/
/*  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("Internal Server Error");
  }
});*/
/*-------- SIGN-UP DATA SAVING IN MONGODB JSON (BSON) --------------------*/

app.get("/complaintdata", (req, res) => {
  if (userdata == null) {
    res.sendFile(__dirname + "/views/index.html");
    return;
  } else {
    res.sendFile(__dirname + "/views/complaint.html");
  }
});
app.post("/complaintdata", async (req, res, next) => {
  if (userdata == null) {
    res.sendFile(__dirname + "/public/index.html");
    res.end();
    return;
  }
  let x = ((Math.random() * (1 - 0 + 1) + 0) % 1).toString().split(".")[1];
  let complaint_id = x;
  //console.log(complaint_id);
  const data = {
    id: req.body.id,
    problem: req.body.problem,
    problem_date: req.body.problem_date,
    location: req.body.location,
    landmark: req.body.landmark,
    contact: req.body.contact,
    complaintid: complaint_id,
    status: "In-Complete",
  };
  /*-------------------------------*/
  try {
    //SETTING UP THE DATABASE POINTS
    const url = "mongodb://127.0.0.1:27017/";
    const client = new MongoClient(url);
    await client.connect();

    console.log("For Raising Complaint, Connected to the database");

    client.db("project_database").collection("complaint").insertOne(data);

    res.render(__dirname + "/public/success.html", {
      successData: "Complaint Successfully Submitted...!",
      link1: "Dashboard",
      link1_url: "/logindata",
      link2: "Contact-Us",
      link2_url: "/contactus",
      link3: "Logout",
      link3_url: "/logout",
    });
    res.end();
  } catch (error) {
    console.error("An Error Occurred:", error);
    res.status(500).send("Internal Server Error");
  }
  //------------------------------------
});
app.post("/signupdata", async function (req, res, next) {
  const data = {
    id: req.body.id,
    pwd: req.body.pwd,
    uname: req.body.uname,
    mob: req.body.mob,
    email: req.body.email,
  };
  //-----------------------------
  if (data.pwd != req.body.reloginpwd) {
    //res.sendFile("/mynodejsproj/public/error.html");
    res.render(__dirname + "/views/error.html", {
      errorData: "Password & Retype Password Not Matched...!!",
    });
    return;
  }
  //-----------------------------
  try {
    //SETTING UP THE DATABASE POINTS
    const url = "mongodb://127.0.0.1:27017/";
    const client = new MongoClient(url);
    await client.connect();

    console.log("For Sign-Up, Connected to the database");
    client
      .db("project_database")
      .collection("projdatabase")
      .find({ id: req.body.id })
      .toArray()
      .then((result) => {
        var dataExist = "";
        if (result != "") {
          dataExist = "Exist";
          res.render(__dirname + "/views/error.html", {
            errorData: "ID Alread Exist, Take New ID...!",
          });
          return;
        } else {
          dataExist = "NotExist";
        }
        if (dataExist == "NotExist") {
          client
            .db("project_database")
            .collection("projdatabase")
            .insertOne(data);
          res.render(__dirname + "/public/success.html", {
            successData: "Record Successfully Saved...!",
            link1: "Home",
            link1_url: "/proj",
            link2: "Contact-Us",
            link2_url: "/contactus",
            link3: "Support",
            link3_url: "/support",
          });
        }
      });
  } catch (error) {
    console.error("An Error Occurred:", error);
    res.status(500).send("Internal Server Error");
  }
});
/* ----Show All Perticular User's Complaints --------------- */
app.get("/mycomplaints", async function (req, res) {
  if (userdata == null) {
    res.sendFile(__dirname + "/public/index.html");
    return;
  }
  try {
    //SETTING UP THE DATABASE POINTS
    //userDataId = id_param;
    const url = "mongodb://127.0.0.1:27017/";
    const client = new MongoClient(url);
    await client.connect();
    //console.log("Connected to the database");
    client
      .db("project_database")
      .collection("complaint")
      .find({ id: userdata })
      .toArray()
      .then((result) => {
        res.render(__dirname + "/views/mycomplaints.html", {
          obj_data: result,
        });
      });
  } catch (error) {
    console.error("An error occurred:", error);
    //res.status(500).send("Internal Server Error");
  }
});
app.get("/view", async function (req, res, next) {
  console.log("View Part is executed...");
  try {
    //SETTING UP THE DATABASE POINTS
    const url = "mongodb://127.0.0.1:27017";
    const client = new MongoClient(url);
    await client.connect();

    console.log("Connected to the database for viewing data...!!");
    client
      .db("project_database")
      .collection("projdatabase")
      .find({})
      .toArray()
      .then((projdatabase) => {
        //const objs = res.status(200).json(projdatabase);
        //const objs = JSON.parse(projdatabase);

        res.render(__dirname + "/views/wholerecords.html", {
          obj_data: projdatabase,
        });
      });

    //res.send("Registered Users: <br>" + "\n" + JSON.stringify(req.body));
  } catch (error) {
    console.error("An Error Occurred:", error);
    res.status(500).send("Internal Server Error");
  }
});

/* --- Here Checking Login Details ----*/
app.post("/logindata", async function (req, res, next) {
  if (userdata != null) {
    res.sendFile(__dirname + "/views/userdashboard.html");
    res.end();
    return;
  }

  app.use(
    session({
      secret: req.body.id,
      saveUninitialized: true,
      resave: true,
    })
  );
  try {
    //SETTING UP THE DATABASE POINTS
    const url = "mongodb://127.0.0.1:27017/";
    //const dbName = "project_database";
    const client = new MongoClient(url);
    await client.connect();

    console.log("Connected to the database");
    client
      .db("project_database")
      .collection("projdatabase")
      .find({ id: req.body.id, pwd: req.body.pwd })
      .toArray()
      .then((result) => {
        if (result != "") {
          console.log(result);
          //----------------------------------
          // User Object
          const user = {
            userid: req.body.id,
            userpwd: req.body.pwd,
          };
          //req.session.user = user;
          //req.session.save();
          userdata = user.userid;
          //----------------------------------
          res.render(__dirname + "/public/userdashboard.html", {
            link1: "Dashboard",
            link1_url: "/logindata",
            link2: "Contact-Us",
            link2_url: "/contactus",
            link3: "Logout",
            link3_url: "/logout",
          });

          res.end();
          return;
        }

        //console.log(result);
        //res.sendFile("/mynodejsproj/public/error.html");
        res.render(__dirname + "/views/error.html", {
          errorData: "Wrong ID / Password",
        });
      });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("Internal Server Error");
  }
});
//-----------UPDATING THE DOCUMENT--------------
app.post("/updatedata", async function (req, res, next) {
  if (req.body.newpwd != req.body.renewpwd) {
    res.sendFile("/mynodejsproj/public/error.html");
    return;
  }
  console.log("Password Update Process");
  try {
    //SETTING UP THE DATABASE POINTS
    const url = "mongodb://127.0.0.1:27017/";
    //const dbName = "project_database";
    const client = new MongoClient(url);
    await client.connect();

    console.log("Connected to the database for Updation...!!");

    client
      .db("project_database")
      .collection("projdatabase")
      .findOneAndUpdate(
        //{ id: "1111" },
        //{ $set: { uname: "Anirudh Bage", mob: "9200001612" } },
        { id: req.body.idinput, pwd: req.body.oldpwd },
        { $set: { pwd: req.body.newpwd } },
        (err, res) => {
          if (err) throw err;
        }
      )

      .then((result) => {
        if (result != "") {
          if (result == null) {
            console.log("ID Not Found....!!");
            res.render(__dirname + "/views/error.html", {
              errorData: "ID NOT Present",
            });
            /* res.render("/mynodejsproj/public/error.html", {
              errorData: "ID NOT FOUND...!",
            });*/
            //res.sendFile("/mynodejsproj/public/error.html");
          } else {
            console.log("Password Updated....!!");
            res.render(__dirname + "/public/success.html", {
              successData: "Password Updated...!!",
              link1: "Dashboard",
              link1_url: "/logindata",
              link2: "Contact-Us",
              link2_url: "/contactus",
              link3: "Logout",
              link3_url: "/logout",
            });
          }
          return;
        }
        //console.log(result);
        res.sendFile("/mynodejsproj/public/error.html");
      });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("Internal Server Error");
  }
});

//----------------------------------------------
/*
//-------------------mongodb-----------------//
mongoose.connect("mongodb://127.0.0.1:27017/project_database");
const userSchema = new mongoose.Schema({
  id: String,
  password: String,
});
const User = new mongoose.model("projdatabase", userSchema);
//-------------------mongodb-----------------//
app.post("/login", async (req, res) => {
  //let { username, password } = req.body;
  const username = req.body.id;
  const password = req.body.pwd;
  console.log(username + " " + password);
  const user = await User.find({ id: username, pwd: password }).lean();
  if (!user) {
    res.status(404).send({ message: "No  User Found" });
  } else {
    console.log("Else wala: " + password + "  " + user.password);
    var validatePassword = await bcrypt.compare(password, user.password);

    if (!validatePassword) {
      //Bajaj Tollfree No. Bajaj Finance 18004194000, Bajaj General COmplaint : 18004193030
      res.status(400).send({ message: "Invalid Password" });
    } else {
      console.log("Success");
      /*
      res.cookie("username", username, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: true,
        httpOnly: true,
        sameSite: "lax",
      });
      res.redirect("/proj");
      */
/*    }
  }
});
*/

//---ANOTHER WAY TO CHECK LOGIN DETAIL------------
/*
app.post("/logincheck", (req, res) => {
  const databasename = "project_database"; // Database name
  const uid = req.body.id;
  const upwd = req.body.pwd;
  console.log(uid + " " + upwd);
  MongoClient.connect(url)
    .then((client) => {
      const connect = client.db(databasename);

      // Connect to collection
      const collection = connect.collection("projdatabase");

      // Fetching the records having id & pwd

      collection
        .find({ id: uid, pwd: upwd })
        .toArray()
        .then((ans) => {
          console.log("Ho to Gaya Hai" + ans);
        });
    })
    .catch((err) => {
      // Printing the error message
      console.log(err.Message);
    });
});
*/
//------------------------------------------
// Handling GET request
app.get("/*", (req, res) => {
  res.send("No Such URL Mapped");
  res.end();
});
/*app.get("/", (req, res) => {
  res.send("A simple Node App is " + "running on this server");
  res.end();
});
*/

// Server Setup
app.listen(PORT, console.log(`Server started on port ${PORT}`));
