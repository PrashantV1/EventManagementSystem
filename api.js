const dboperations = require("./dboperations");

var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", router);

router.use((request, response, next) => {
  console.log("middleware ");
  next();
});

router
  .route("/insertuser/:name/:email/:username/:pass")
  .get((request, response) => {
    dboperations
      .insert_user(
        request.params.name,
        request.params.email,
        request.params.username,
        request.params.pass,
      )
      .then((result) => {
        response.json(result);
      });
  });

router.route("/updatepassword/:id/:pass").get((request, response) => {
  dboperations
    .updatepassword(request.params.id, request.params.pass)
    .then((result) => {
      response.json(result);
    });
});


router.route("/reset_Password/:id").get((request, response) => {
  dboperations.reset_Password(request.params.id).then((result) => {
    response.json(result);
  });
});




router.route("/validlogin/:id/:pass").get((request, response) => {
  dboperations
    .validlogin(request.params.id, request.params.pass)
    .then((result) => {
      response.json(result);
    });
});


router.route("/updatesession/:id").get((request, response) => {
  dboperations.updatesession(request.params.id).then((result) => {
    response.json(result);
  });
});

router.route("/getsession/:id").get((request, response) => {
  dboperations.getusersession(request.params.id).then((result) => {
    response.json(result);
  });
});

var port = process.env.PORT || 8090;
app.listen(port);
console.log(" API is runnning at " + port);

// dboperations.getresult().then((result) => {
//   console.log(result);
// });
