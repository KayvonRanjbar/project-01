
// This file allows us to seed our application with data
// simply run: `node seed.js` from the root of this project folder.

var db = require("./models");

var projectsList =[
  // put data here!
];

projectsList.push({
             what: 'Help me landscape',
             when: '2015-12-10',
             where: '124 Bee Dr, Oakland, CA, 32423',
             image: 'http://www.psp.wa.gov/downloads/PSSH_Toolkit/elements/Tree.jpg'
           });
projectsList.push({
             what: 'Feed the children',
             when: '2015-12-29',
             where: '7345 Apple Ct, Oakland, CA, 34234',
             image: 'https://tse1.mm.bing.net/th?&id=OIP.M0874035ddc17b61c6b2922853846bce6o0&w=300&h=300&c=0&pid=1.9&rs=0&p=0&r=0'
           });
projectsList.push({
             what: 'Operation Lift Grandma',
             when: '2016-01-30',
             where: '43534 Halo Rd, Richmond, CA, 54234',
             image: 'http://images.clipartlogo.com/files/ss/thumb/178/17829961/vector-elderly-couple_small.jpg'
           });
projectsList.push({
             what: 'Cuddle the giraffes',
             when: '2016-02-13',
             where: '23664 Mongo Way, Daly City, CA, 34523',
             image: 'http://icons.iconarchive.com/icons/icons8/windows-8/512/Animals-Dog-icon.png'
           });

var sampleOrganizers = [];

sampleOrganizers.push({ firstName: 'Bob',
                   lastName: 'Anderson'
});

projectsList.forEach(function(project) {
  project.organizers = sampleOrganizers;
});

db.Project.remove({}, function(err, projects){

  db.Project.create(projectsList, function(err, projects){
    if (err) { return console.log('ERROR', err); }
    console.log("all projects:", projects);
    console.log("created", projects.length, "projects");
    process.exit();
  });

});