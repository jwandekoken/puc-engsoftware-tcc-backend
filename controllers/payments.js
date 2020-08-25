const { validationResult } = require("express-validator");

const SignaturePlan = require("../models/signaturePlan");
const Payment = require("../models/payment");

exports.createNew = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Erro de validação. Cheque os inputs informados.");
    error.httpStatusCode = 422;
    return next(error);
  }

  const { signaturePlanId, paymentDate } = req.body;

  SignaturePlan.findById(signaturePlanId)
    .populate("client_id")
    .exec()
    .then((signaturePlan) => {
      const newPayment = new Payment({
        signaturePlan_id: signaturePlanId,
        paymentDate: paymentDate,
        value: signaturePlan.price,
      });

      newPayment
        .save()
        .then((savedPayment) => {
          res.json({
            savedPayment,
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
