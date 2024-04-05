var express = require("express");
var cors = require("cors");
var busboy = require("connect-busboy");
var fs = require("fs-extra");
require("dotenv").config();

var app = express();

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));
app.use(busboy());

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/fileanalyse", function (req, res) {
  req.pipe(req.busboy);
  req.busboy.on("file", function (fieldname, file, filename) {
    let filesize = 0;

    file.on("data", (data) => {
      filesize += data.length;
    });

    file.on("end", () => {
      res.json({
        name: filename.filename,
        type: filename.mimeType,
        size: filesize,
      });
    });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
