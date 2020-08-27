const { validationResult } = require("express-validator");

const SignaturePlan = require("../models/signaturePlan");
const Payment = require("../models/payment");
const User = require("../models/user");

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

exports.unpaying = (req, res, next) => {
  const { name, startingDate, finishingDate } = req.body;

  // make search for unpaying customers without paramethers
  if (!name || !startingDate || !finishingDate) {
    User.find({ userType: "cliente" }, "_id")
      .then((users) => {
        const signaturePlanQueries = [];

        users.forEach((user) => {
          signaturePlanQueries.push(
            SignaturePlan.findOne({ client_id: user._id }).exec()
          );
        });

        Promise.all(signaturePlanQueries)
          .then((listOfSignaturePlans) => {
            const paymentsQueries = [];

            listOfSignaturePlans.forEach((plan) => {
              paymentsQueries.push(
                Payment.find({ signaturePlan_id: plan._id }).exec()
              );
            });

            Promise.all(paymentsQueries)
              .then((listOfPayments) => {
                res.json({
                  listOfSignaturePlans,
                  listOfPayments,
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
  }
};
