var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/my-serveNow-db");
var Project = require('./project');
var Where = require('./where');

module.exports.Project = Project;
module.exports.Where = Where;