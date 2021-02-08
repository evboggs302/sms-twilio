var mongoose = require("mongoose");
var fs = require("fs");

module.exports = {
  saveImage: (req, res, next) => {
    console.log("::::grid");
    console.log("SAVE IMAGE REQ: ", req);
    //const gridfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
    //const writeStream = gridfs.openUploadStream('test.dat');

    var gridfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      chunkSizeBytes: 1024,
      bucketName: "images",
    });
    fs.createReadStream("./IMG_1727.JPG")
      .pipe(gridfs.openUploadStream("def1.txt"))
      .on("error", (error) => {
        console.log({ errMsg: error });
        // assert.ifError(error);
      })
      .on("finish", () => {
        console.log("done!");
        process.exit(0);
      });
  },

  getImage: (req, res, next) => {
    var gridfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      chunkSizeBytes: 1024,
      bucketName: "songs",
    });
    /* var bucket = new mongodb.GridFSBucket(db, {
        chunkSizeBytes: 1024,
        bucketName: 'songs'
      }); */

    gridfs
      .openDownloadStreamByName("def1.txt")
      .pipe(fs.createWriteStream("./def1.txt"))
      .on("error", (error) => {
        console.log(":::error");
        // assert.ifError(error);
      })
      .on("finish", () => {
        console.log("done!");
        process.exit(0);
      });
  },
};
