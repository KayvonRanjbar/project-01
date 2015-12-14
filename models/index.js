var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/my-serveNow-db");
var Project = require('./project');

module.exports.Project = Project;