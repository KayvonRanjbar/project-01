// SERVER-SIDE JAVASCRIPT

//require express in our app
var express = require('express');
// generate a new express app and call it 'app'
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// serve static files from public folder
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

/************
 * DATABASE *
 ************/

var db = require('./models');

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', function api_index (req, res){
  res.json({
    message: "Welcome to tunely!",
    documentation_url: "https://github.com/tgaff/tunely/api.md",
    base_url: "http://tunely.herokuapp.com",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
});

app.get('/api/projects', function projectsIndex(req, res) {
  db.Project.find({}, function(err, projects) {
    res.json(projects);
  });
});

app.post('/api/projects', function projectCreate(req, res) {
  console.log('body', req.body);

  db.Project.create(req.body, function(err, project) {
    if (err) { console.log('error', err); }
    console.log(project);
    res.json(project);
  });

});

app.post('/api/projects/:projectId/wheres', function wheresCreate(req, res) {
  console.log('body', req.body);
  db.Project.findOne({_id: req.params.projectId}, function(err, project) {
    if (err) { console.log('error', err); }

    var where = new db.Where(req.body);
    project.wheres.push(where);
    project.save(function(err, savedProject) {
      if (err) { console.log('error', err); }
      console.log('project with new where saved:', savedProject);
      res.json(where);
    });
  });
});

app.get('/api/projects/:id', function projectShow(req, res) {
  console.log('requested project id=', req.params.id);
  db.Project.findOne({_id: req.params.id}, function(err, project) {
    res.json(project);
  });
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
