
// This file allows us to seed our application with data
// simply run: `node seed.js` from the root of this project folder.

var db = require("./models");

var projectsList =[
  // put data here!
];

projectsList.push({
             what: 'Help me landscape',
             when: 'December 18, 2015',
             why: 'Please...!',
             image: 'http://www.psp.wa.gov/downloads/PSSH_Toolkit/elements/Tree.jpg'
           });
projectsList.push({
             what: 'Feed the children',
             when: 'December 19, 2015',
             why: 'Because they\'re young and hungry',
             image: 'https://tse1.mm.bing.net/th?&id=OIP.M0874035ddc17b61c6b2922853846bce6o0&w=300&h=300&c=0&pid=1.9&rs=0&p=0&r=0'
           });
projectsList.push({
             what: 'Operation Lift Grandma',
             when: 'sdfsdf',
             why: 'sadfsadf',
             image: 'http://images.clipartlogo.com/files/ss/thumb/178/17829961/vector-elderly-couple_small.jpg'
           });
projectsList.push({
             what: 'Cuddle the giraffes',
             when: 'fgj',
             why: 'asdf',
             image: 'http://icons.iconarchive.com/icons/icons8/windows-8/512/Animals-Dog-icon.png'
           });

db.Project.remove({}, function(err, projects){

  db.Project.create(projectsList, function(err, projects){
    if (err) { return console.log('ERROR', err); }
    console.log("all projects:", projects);
    console.log("created", projects.length, "projects");
    process.exit();
  });

});