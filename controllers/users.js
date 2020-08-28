const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        const error = new Error("Credenciais inválidas, tente novamente.");
        error.httpStatusCode = 403;
        return next(error);
      }

      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          console.log(err);
          return next(err);
        }
        if (!result) {
          const error = new Error("Credenciais inválidas, tente novamente.");
          return next(error);
        } else {
          jwt.sign(
            { loggedUserId: user._id },
            "mySuperSecretDontShare",
            { expiresIn: "5h" },
            (err, token) => {
              if (err) {
                const error = new Error(err);
                return next(error);
              }
              res.json({
                token,
              });
            }
          );
        }
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      return next(error);
    });
};

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Erro de validação. Cheque os inputs informados.");
    error.httpStatusCode = 422;
    return next(error);
  }

  User.findById(req.loggedUserId)
    .then((loggedUser) => {
      if (!loggedUser) {
        const error = new Error("Você não tem permissões para isso.");
        error.httpStatusCode = 401;
        return next(error);
      }

      if (
        loggedUser.userType === "cliente" ||
        loggedUser.userType === "instrutor"
      ) {
        const error = new Error("Você não tem permissões para isso.");
        error.httpStatusCode = 401;
        return next(error);
      }

      const {
        name,
        email,
        password,
        cpf,
        rg,
        userType,
        address,
        typeOfActivity,
      } = req.body;

      User.findOne({ email })
        .then((user) => {
          if (user) {
            const error = new Error("Email informado já cadastrado.");
            error.httpStatusCode = 422;
            return next(error);
          }

          bcrypt
            .hash(password, 12)
            .then((hashedPassword) => {
              const newUser = new User({
                name,
                email,
                password: hashedPassword,
                cpf,
                rg,
                userType,
                address,
                typeOfActivity,
              });

              newUser
                .save()
                .then((user) => {
                  res.json({
                    user,
                  });
                })
                .catch((err) => {
                  console.log(err);
                  const error = new Error(err);
                  return next(error);
                });
            })
            .catch((err) => {
              console.log(err);
              const error = new Error(err);
              return next(error);
            });
        })
        .catch((err) => {
          console.log(err);
          const error = new Error(err);
          return next(error);
        });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      return next(error);
    });
};

exports.getUsers = (req, res, next) => {
  User.find({}, "-password")
    .then((users) => {
      res.json({
        users,
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      return next(error);
    });
};

exports.updateInstructor = (req, res, next) => {
  const { name, cpf, rg, typeOfActivity } = req.body;

  const instructorId = req.params.instructorId;

  User.findById(instructorId)
    .then((instructor) => {
      if (!instructor) {
        const error = new Error("Instrutor não encontrado.");
        return next(error);
      }

      if (instructor.userType !== "instrutor") {
        const error = new Error("Usuário não é um instrutor");
        return next(error);
      }

      if (name) instructor.name = name;
      if (cpf) instructor.cpf = cpf;
      if (rg) instructor.rg = rg;
      if (typeOfActivity) instructor.typeOfActivity = typeOfActivity;

      instructor
        .save()
        .then((updatedInstructor) => {
          res.json({
            updatedInstructor,
          });
        })
        .catch((err) => {
          console.log(err);
          const error = new Error(err);
          return next(error);
        });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      return next(error);
    });
};

exports.deleteInstructor = (req, res, next) => {
  const instructorId = req.params.instructorId;

  User.findById(instructorId)
    .then((instructor) => {
      if (!instructor) {
        const error = new Error("Instrutor não encontrado.");
        return next(error);
      }

      if (instructor.userType !== "instrutor") {
        const error = new Error("Usuário não é um instrutor");
        return next(error);
      }

      instructor
        .remove()
        .then((deleteResult) => {
          console.log(deleteResult);
          res.json({
            message: "Instrutor deletado",
          });
        })
        .catch((err) => {
          console.log(err);
          const error = new Error(err);
          return next(error);
        });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      return next(error);
    });
};
