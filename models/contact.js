const {Schema, model} = require('mongoose');

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  marked: {
    type: Boolean,
    default: false
  }
});

module.exports = model('Contact', schema)