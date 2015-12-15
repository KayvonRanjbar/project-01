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

app.get('/api/projects/:id/organizers', function projectShow(req, res) {
  console.log('requested project id=', req.params.id);
  db.Project.findOne({_id: req.params.id}, function(err, project) {
    res.json(project.organizers);
  });
});

app.post('/api/projects/:projectId/organizers', function organizersCreate(req, res) {
  console.log('body', req.body);
  db.Project.findOne({_id: req.params.projectId}, function(err, project) {
    if (err) { console.log('error', err); }

    var organizer = new db.Organizer(req.body);
    project.organizers.push(organizer);
    project.save(function(err, savedProject) {
      if (err) { console.log('error', err); }
      console.log('project with new organizer saved:', savedProject);
      res.json(organizer);
    });
  });
});

app.get('/api/projects/:id', function projectShow(req, res) {
  console.log('requested project id=', req.params.id);
  db.Project.findOne({_id: req.params.id}, function(err, project) {
    res.json(project);
  });
});

app.delete('/api/projects/:id', function deleteProject(req, res) {
  console.log('deleting id: ', req.params.id);
  db.Project.remove({_id: req.params.id}, function(err) {
    if (err) { return console.log(err); }
    console.log("removal of id=" + req.params.id  + " successful.");
    res.status(200).send(); // everything is OK
  });
});

app.put('/api/projects/:id', function updateProject(req, res) {
  console.log('updating id ', req.params.id);
  console.log('received body ', req.body);

  db.Project.findOne({_id: req.params.id}, function(err, foundProject) {
    if (err) { console.log('error', err); }
    foundProject.when = req.body.when;
    foundProject.what = req.body.what;
    foundProject.where = req.body.where;
    foundProject.save(function(err, saved) {
      if(err) { console.log('error', err); }
      res.json(saved);
    });
  });
});

app.put('/api/projects/:projectId/organizers/:id', function(req, res) {
  var projectId = req.params.projectId;
  var organizerId = req.params.id;
  db.Project.findOne({_id: projectId}, function (err, foundProject) {
    // find organizer embedded in project
    var foundOrganizer = foundProject.organizers.id(organizerId);
    foundOrganizer.firstName = req.body.firstName;
    foundOrganizer.lastName = req.body.lastName;
    foundOrganizer.email = req.body.email;

    // save changes
    foundProject.save(function(err, saved) {
      if(err) { console.log('error', err); }
      res.json(saved);
    });
  });
});

app.delete('/api/projects/:projectId/organizers/:id', function(req, res) {
  var projectId = req.params.projectId;
  var organizerId = req.params.id;
  console.log(req.params);
  db.Project.findOne({_id: projectId}, function (err, foundProject) {
    if (err) {console.log(error, err);}
    // find organizer embedded in project
    var foundOrganizer = foundProject.organizers.id(organizerId);
    // delete
    foundOrganizer.remove();
    // save changes
    foundProject.save(function(err, saved) {
      if(err) { console.log('error', err); }
      res.json(saved);
    });
  });
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
