var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var OrganizerSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String
});

var Organizer = mongoose.model('Organizer', OrganizerSchema);

module.exports = Organizer;