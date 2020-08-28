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
    SignaturePlan.find({})
      .populate("client_id")
      .exec()
      .then((listOfSignaturePlans) => {
        const paymentsQueries = [];

        listOfSignaturePlans.forEach((plan) => {
          paymentsQueries.push(
            Payment.findOne({ signaturePlan_id: plan._id }).exec()
          );
        });

        Promise.all(paymentsQueries)
          .then((listOfPayments) => {
            const currentDate = new Date();

            const signaturePlansArr = listOfSignaturePlans.map((plan) => {
              const planStartingDate = new Date(plan.dateOfStart);

              if (plan.planType === "mensal") {
                let monthsSinceStart =
                  (currentDate.getFullYear() - planStartingDate.getFullYear()) *
                  12;
                monthsSinceStart =
                  monthsSinceStart - planStartingDate.getMonth();
                monthsSinceStart = monthsSinceStart + currentDate.getMonth();
                monthsSinceStart = monthsSinceStart <= 0 ? 0 : monthsSinceStart;

                const paymentsNeeded = monthsSinceStart + 1;

                const planPayments = listOfPayments.filter(
                  (payment) =>
                    payment.signaturePlan_id.toString() === plan._id.toString()
                );

                return {
                  ...plan._doc,
                  unpayments: paymentsNeeded - planPayments.length,
                };
              } else if (plan.planType === "anual") {
                let yearsSinceStart =
                  currentDate.getFullYear() - planStartingDate.getFullYear();

                const paymentsNeeded = yearsSinceStart + 1;

                const planPayments = listOfPayments.filter(
                  (payment) =>
                    payment.signaturePlan_id.toString() === plan._id.toString()
                );

                return {
                  ...plan._doc,
                  unpayments: paymentsNeeded - planPayments.length,
                };
              }
            });

            res.json({
              signaturePlansArr,
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
