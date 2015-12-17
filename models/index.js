var mongoose = require("mongoose");
mongoose.connect( process.env.MONGOLAB_URI || 
									process.env.MONGOHQ_URL || 
									"mongodb://localhost/my-serveNow-db");
var Project = require('./project');
var Organizer = require('./organizer');

module.exports.Project = Project;
module.exports.Organizer = Organizer;