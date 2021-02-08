require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const server = require("http").Server(app);
const cors = require("cors");
// const io = require("socket.io")(server);
const mongoose = require("mongoose");
const { MONGO_CONNECTION, SESSION_SECRET, SERVER_PORT } = process.env;
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
// const {} = require("./controllers/responseController");
const {
  sendSMS,
  sendMMS,
  saveResponse,
  incomingMSG,
} = require("./controllers/twilioController");

// SERVER INIT
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// SESSIONS
const session = require("express-session");
app.use(
  session({
    saveUninitialized: false,
    secret: SESSION_SECRET,
    resave: true,
    cookie: {
      secure: "auto",
      maxAge: 1000 * 60 * 60 * 24, // 24hr cookie
    },
  })
);

// MONGODB Connection
mongoose
  .connect(MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Database"))
  .catch(() => console.log("Mongo failed"));

// TEST END POINT
app.get("/api/get_test", (req, res, next) => {
  res.send("endpoint test complete");
});

// USER & AUTH ENDPOINTS
app.get("/api/getAllUsers", getAllUsers); // PostMan Confirmed
app.get("/api/getUser", getSingleUser); // PostMan Confirmed
app.post("/api/addUser", getSingleUserByUserName, addUser); // PostMan Confirmed
app.post("/api/login", login); // PostMan Confirmed
app.get("/api/logout", logout);

// TWILIO ENDPOINTS
app.post("/api/sendtxt", sendSMS); // PostMan Confirmed
app.post("/api/sendmedia", sendMMS); // PostMan Confirmed
app.post("/api/receiveTwillioMsg", saveResponse, incomingMSG);
// app.post("/api/sendMMS", incomingMSG);
// app.post("/api/sendSMS", incomingMSG);

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

// Becasue of browser router, you need the below lines.
const path = require("path");
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/../build/index.html"));
});

server.listen(SERVER_PORT, () =>
  console.log(`SERVER on 💩 port: ${SERVER_PORT}`)
);
