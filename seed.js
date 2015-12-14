
// This file allows us to seed our application with data
// simply run: `node seed.js` from the root of this project folder.

var db = require("./models");

var projectsList =[
  // put data here!
];

projectsList.push({
             what: 'Help Kayvon move!',
             when: 'December 18, 2015',
             why: 'Because he has a lot of stuff!',
           });
projectsList.push({
             what: 'Feed the children',
             when: 'December 19, 2015',
             why: 'Because they\'re young and hungry'
           });
projectsList.push({
             what: 'asdf',
             when: 'sdfsdf',
             why: 'sadfsadf',
           });
projectsList.push({
             what: 'gfhfgh',
             when: 'fgj',
             why: 'asdf',
           });

db.Project.remove({}, function(err, projects){

  db.Project.create(projectsList, function(err, projects){
    if (err) { return console.log('ERROR', err); }
    console.log("all projects:", projects);
    console.log("created", projects.length, "projects");
    process.exit();
  });

});