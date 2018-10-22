const express = require("express");
const hbs = require("hbs");
const fs = require("fs");

const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + "/views/partials");

hbs.registerHelper("getCurrentYear", () => {
  return new Date().getFullYear();
});
hbs.registerHelper("screamIt", (text) => {
  return text.toUpperCase();
});

//middleway function. next() is essential in order to continue the code and execute the next middleway
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);

  fs.appendFile("server.log", log + "\n", (err) => {
    if (err) console.log("Unable to append to server.log");
  });

  next();
});

app.set("view engine", "hbs"); //setting up the handlebars template framework and use it as the view engine
app.use(express.static(__dirname + "/_public")); //__dirname is the projects directionname (node-webserver in this case) which is provided by the global function of node around every module

//maintenance mode
// app.use((req, res, next) => {
//   console.log("Maintenance Modus!");
//   res.render("maintenance.hbs");
// });

//REQ (Request): information about the request
//RES (Response): anything i am gonna to return
app.get("/", (req, res) => {
  //res.send("<h1>Hello Express</h1>");
  res.render("home.hbs", {
    pagetitle: "Homepage",
    welcomeMessage: "Welcome to my Homepage",
    name: "Marius"
  });
});

app.get("/about", (req, res) => {
  res.render("about.hbs", {
    pagetitle: "About Page"
  });
});

app.get("/bad", (req, res) => {
  res.send({
    status: 404,
    errorMessage: "This site does not exist"
  });
});
//listen to port 3000 (localhost)
app.listen(port, () => {
  console.log("Server is up on port " + port);
});
