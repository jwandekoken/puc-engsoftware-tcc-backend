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

    if (!decoded) {
      const error = new Error("Falha na autenticação.");
      error.httpStatusCode = 401;
      throw error;
    } else {
      req.loggedUserId = decoded.loggedUserId;
      next();
    }
  });
};
