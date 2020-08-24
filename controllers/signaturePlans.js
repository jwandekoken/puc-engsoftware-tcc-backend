const { validationResult } = require("express-validator");

const User = require("../models/user");
const SignaturePlan = require("../models/signaturePlan");

exports.createNew = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Erro de validação. Cheque os inputs informados.");
    error.httpStatusCode = 422;
    return next(error);
  }

  const { clientId, planType, price } = req.body;

  if (planType !== "mensal" && planType !== "anual") {
    const error = new Error("Tipo do plano informado não existe.");
    error.httpStatusCode = 422;
    return next(error);
  }

  User.findById(clientId)
    .then((user) => {
      if (!user) {
        const error = new Error("Cliente informado não existe.");
        error.httpStatusCode = 404;
        return next(error);
      }

      const newSignaturePlan = new SignaturePlan({
        client_id: clientId,
        planType,
        dateOfStart: Date.now(),
        price,
      });

      newSignaturePlan
        .save()
        .then((signaturePlan) => {
          res.json({
            signaturePlan,
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
