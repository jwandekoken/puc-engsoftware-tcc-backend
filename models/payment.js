const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  signaturePlan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "signaturePlan",
    required: true,
  },
  paymentDate: {
    type: Date,
    required: true,
  },
  value: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
});

module.exports = mongoose.model("payment", paymentSchema);
