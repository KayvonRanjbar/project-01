var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/my-serveNow-db");
var Project = require('./project');
var Organizer = require('./organizer');

module.exports.Project = Project;
module.exports.Organizer = Organizer;