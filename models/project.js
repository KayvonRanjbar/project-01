var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  what: String,
  when: String,
  why: String
});

var Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;