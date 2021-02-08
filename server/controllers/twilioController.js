const mongoose = require("mongoose");
const { ACCT_SID, AUTH_TOKEN, TWILIO_NUMBER, MONGO_CONNECTION } = process.env;
const client = require("twilio")(ACCT_SID, AUTH_TOKEN);
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const twilio = require("twilio");
const AccessToken = twilio.jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;

module.exports = {
  sendSMS: (req, res) => {
    let { recip, msg } = req.body;
    res.status(200).send("twilio end points commented out");
    // client.messages
    //   .create({
    //     body: msg,
    //     from: `${TWILIO_NUMBER}`,
    //     to: `+1${recip}`,
    //   })
    //   .then((message) => {
    //     console.log(message);
    //     res.status(200).send(message);
    //   })
    //   .catch((err) => res.status(500).send({ ERROR: err }));
  },
  sendMMS: (req, res, next) => {
    let { recip, msg } = req.body;
    res.status(200).send("twilio end points commented out");
    // client.messages
    //   .create({
    //     body: msg,
    //     from: `${TWILIO_NUMBER}`,
    //     to: `+1${recip}`,
    //     // mediaUrl: ["https://demo.twilio.com/owl.png"], //this works
    //     mediaUrl: [URL.createObjectURL(img)], // img comes from Mongo
    //   })
    //   .then((message) => {
    //     console.log(message);
    //     res.status(200).send(message);
    //   })
    //   .catch((err) => res.status(500).send({ ERROR: err }));
  },
  saveResponse: (req, res, next) => {
    console.log("SAVE RESPONSE: ", req.body, "\n");
    next();
  },
  incomingMSG: (req, res, next) => {
    console.log("INCOMING MSG: ", req.body, "\n");
    const twiml = new MessagingResponse();
    if (req.body.Body === "Hey") {
      twiml.message("Hi!");
    } else if (req.body.Body === "bye") {
      twiml.message("Goodbye");
    } else {
      twiml.message(
        "No Body param match, Twilio sends this in the request to your server."
      );
    }

    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  },
  tokenGenerator: (identity) => {
    const appName = "Scavenger-Hunt";

    // Create a "grant" which enables a client to use Chat as a given user
    const chatGrant = new ChatGrant({
      serviceSid: process.env.TWILIO_CHAT_SERVICE_SID,
    });

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY,
      process.env.TWILIO_API_SECRET
    );

    token.addGrant(chatGrant);
    token.identity = identity;

    return token;
  },
};
