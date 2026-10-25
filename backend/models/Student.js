const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  present: { type: Boolean, default: true },
  marks: { type: Number, default: 0 }
});
module.exports = mongoose.model('Student', studentSchema);