const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model("Image", imageSchema, "images"); // modelName, schemaName, collectionName
