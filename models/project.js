var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Organizer = require('./organizer');

var ProjectSchema = new Schema({
  what: String,
  when: String,
  where: String,
  image: String,
  organizers: [Organizer.schema]
});

var Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;