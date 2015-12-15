var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var WhereSchema = new Schema({
  name: String,
  address: String
});

var Where = mongoose.model('Where', WhereSchema);

module.exports = Where;