require("dotenv").config();
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const {
  ACCT_SID,
  AUTH_TOKEN,
  TWILIO_NUMBER,
  MONGO_CONNECTION,
  SESSION_SECRET,
  SERVER_PORT,
} = process.env;
const {
  getAllUsers,
  getSingleUser,
  getSingleUserByUserName,
  addUser,
  login,
  logout,
} = require("./controllers/userController");
// const {} = require("./controllers/teamController");
// const {} = require("./controllers/eventController");
// const {} = require("./controllers/clueController");
const { saveImage } = require("./controllers/responseController");

// SERVER INIT
app.use(express.json());

// SESSIONS
const session = require("express-session");
app.use(
  session({
    saveUninitialized: false,
    secret: SESSION_SECRET,
    resave: true,
    cookie: {
      secure: "auto",
      maxAge: 1000 * 60 * 60 * 24, // 24 cookie
    },
  })
);

// MONGODB Connection
const mongoose = require("mongoose");
const { MongoClient, ObjectID } = require("mongoose").mongo;
const multer = require("multer");
const fs = require("fs");
const { Readable } = require("stream");
// console.log("MONGO:\n", mongoose.mongo);
var db;
// MongoClient.connect(
//   MONGO_CONNECTION,
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   },
//   (err, database) => {
//     if (err) {
//       console.log(
//         "MongoDB Connection Error. Please make sure that MongoDB is running."
//       );
//       process.exit(1);
//     } else {
//       db = database;
//       console.log("Connected to Database");
//     }
//   }
// );
mongoose
  .connect(MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Database");
    db = mongoose.connection.db;
  })
  .catch(() => console.log("Mongo failed"));

// USER & AUTH ENDPOINTS
app.get("/api/getAllUsers", getAllUsers); // PostMan Confirmed
app.get("/api/getUser", getSingleUser); // PostMan Confirmed
app.post("/api/addUser", getSingleUserByUserName, addUser); // PostMan Confirmed
app.post("/api/login", login); // PostMan Confirmed
app.get("/api/logout", logout);

// IMAGE ENDPOINTS
// app.post("/api/savePhoto", (req, res) => {
//   // sending a POST request with the ‘multipart/formdata’ content type in the header, add a track name and binary track to the request body.
//   const storage = multer.memoryStorage();
//   const upload = multer({
//     storage: storage,
//     limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 }, // this is optional
//   });
//   upload.single("image")(req, res, (err) => {
//     if (err) {
//       return res
//         .status(400)
//         .json({ message: "Upload Request Validation Failed" });
//     } else if (!req.body.name) {
//       return res.status(400).json({ message: "No image name in request body" });
//     }

//     let imageName = req.body.name;

//     // Covert buffer to Readable Stream
//     const readableTrackStream = new Readable();
//     readableTrackStream.push(req.file.buffer);
//     readableTrackStream.push(null); //signifies the end of the data

//     let bucket = new mongoose.mongo.GridFSBucket(db, {
//       bucketName: "images",
//     });

//     let uploadStream = bucket.openUploadStream(imageName);
//     let id = uploadStream.id;
//     readableTrackStream.pipe(uploadStream);

//     uploadStream.on("error", () => {
//       return res.status(500).json({ message: "Error uploading file" });
//     });

//     uploadStream.on("finish", () => {
//       return res.status(201).json({
//         message:
//           "File uploaded successfully, stored under Mongo ObjectID: " + id,
//       });
//     });
//   });
// });
app.post("/api/savePhoto", saveImage);

// SOCKET.IO EVENT ENDPOINTS
// io.on("connection", (socket) => {
//   console.log("socket hit");
//   socket.on("get responses", () => {
//     const db = app.get("db");
//     db.shared_community().then((data) => {
//       io.emit("allUnAnswered", data);
//     });
//   });
//   socket.on("disconnect", () => {
//     console.log("DISCONNECTED");
//   });
// });

// TWILIO ENDPOINTS
const client = require("twilio")(ACCT_SID, AUTH_TOKEN);
app.post("/api/sendtxt", (req, res) => {
  let { recipient, sms_msg } = req.body;
  client.messages
    .create({
      body: sms_msg,
      from: `${TWILIO_NUMBER}`,
      to: `+1${recipient}`,
    })
    .then((message) => {
      res.status(200).send(message);
    });
});

// Becasue of browser router, you need the below lines.
// const path = require("path");
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "/../build/index.html"));
// });

server.listen(SERVER_PORT, () =>
  console.log(`SERVER on 💩 port: ${SERVER_PORT}`)
);
