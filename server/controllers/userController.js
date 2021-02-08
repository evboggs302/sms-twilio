// import the User Model/Schema mongoose created
const User = require("./models/users");
const mongoose = require("mongoose");
const Bcrypt = require("bcryptjs");

module.exports = {
  getAllUsers: (req, res, next) => {
    User.find({})
      .then((users) => {
        res.status(200).send(users);
      })
      .catch((err) => res.status(500).send(err));
  },
  getSingleUser: (req, res, next) => {
    const { id } = req.body;
    User.findById(id)
      .exec()
      .then((user) => {
        res.status(200).send(user);
      });
  },
  getSingleUserByUserName: (req, res, next) => {
    const { userName } = req.body;
    User.find({ userName: userName })
      .exec()
      .then((found) => {
        return found.length > 0
          ? res.status(500).send({ message: "Username already exists." })
          : next();
      });
  },
  addUser: (req, res, next) => {
    const { firstName, lastName, userName, password } = req.body;
    let hashedPw = Bcrypt.hashSync(password, 10);
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      userName: userName,
      password: hashedPw,
      firstName: firstName,
      lastName: lastName,
      events: [],
    });
    user.save((err) => {
      if (err) {
        res.status(400).send({ error: err });
      }
      User.find(user._id)
        .exec()
        .then((user) => {
          // res.status(200).send(user); // for PostMan
          const { userName, _id, events, firstName, lastName } = user;
          req.session.user = { userName, _id, events, firstName, lastName };
          res.status(200).send(req.session.user);
        });
    });
  },
  login: async (req, res, next) => {
    const { username, password } = req.body;
    console.log("login sess: ", req.session);
    try {
      var user = await User.findOne({
        username: username,
      }).exec();
      if (!user) {
        return res.status(400).send({ message: "The username does not exist" });
      } else if (!Bcrypt.compareSync(password, user.password)) {
        return res.status(400).send({ message: "The password is invalid" });
      } else {
        // res.status(200).send(user); // for PostMan
        const { userName, _id, events, firstName, lastName } = user;
        req.session.user = { userName, _id, events, firstName, lastName };
        res.status(200).send(req.session.user);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
  logout: (req, res, next) => {
    req.session.destroy();
    res.status(200).send("logged out dude!");
  },
};
