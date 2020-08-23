const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PATCH, DELETE"
  );
});

// error middleware
app.use((error, req, res, next) => {
  res.status(error.httpStatusCode || 500).json({
    message:
      error.message || "Um erro desconhecido ocorreu. Contate o desenvolvedor.",
  });
});

mongoose
  .connect("mongodb://localhost:27017/engsoftpuctcc", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(5000, () => console.log("Server started on port 5000"));
  })
  .catch((err) => {
    console.log(err);
    next(err);
  });
