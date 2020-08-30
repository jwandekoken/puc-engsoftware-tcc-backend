const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    minlength: 6,
  },
  cpf: {
    type: String,
    required: true,
  },
  rg: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
  address: {
    street: {
      type: String,
    },
    houseNumber: {
      type: String,
    },
    neighbourhood: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
  },
  biometry: {
    type: String,
  },
  typeOfActivity: {
    type: String,
  },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("user", userSchema);
