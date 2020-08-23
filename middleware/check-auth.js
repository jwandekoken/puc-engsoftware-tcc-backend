const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  const token = req.headers.authorization;

  if (!token) {
    throw new Error("Falha na autenticação.");
  }

  jwt.verify(token, "mySuperSecretDontShare", (err, decoded) => {
    if (err) {
      throw new Error("Falha na autenticação.");
    }

    console.log(decoded);
    next();
  });
};
