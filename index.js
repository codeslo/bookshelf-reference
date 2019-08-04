const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const logger = require("morgan");
const routes = require("./routes/routes");

app.get("/", (req, res) => {
  res.status(200).json({ response: "Hello from booshelf test" });
});

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/", routes);

app.listen(process.env.port || 3000, () => {
  console.log("Bookshelf test running");
});
