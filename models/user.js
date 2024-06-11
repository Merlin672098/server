const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
    trim: true,
  },
  email: {
    required: true,
    type: String,
    trim: true,
    validate: {
      validator: (value) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return value.match(re);
      },
      message: "Please enter a valid email address",
    },
  },
  password: {
    required: true,
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  modoOscuro: {
    type: Boolean,
    default: false,
  },
  verificacion: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("users", userSchema);
module.exports = { User, userSchema };
