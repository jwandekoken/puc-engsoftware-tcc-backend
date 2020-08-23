const mongoose = require("mongoose");

const signaturePlanSchema = new mongoose.Schema({
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  planType: {
    type: String,
    required: true,
  },
  dateOfStart: {
    type: Date,
    required: true,
  },
  dateOfEnd: {
    type: Date,
  },
  price: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
});

module.exports = mongoose.model("signaturePlan", signaturePlanSchema);
