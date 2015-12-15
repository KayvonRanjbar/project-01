var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Where = require('./where');

var ProjectSchema = new Schema({
  what: String,
  when: String,
  why: String,
  image: String,
  wheres: [Where.schema]
});

var Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;