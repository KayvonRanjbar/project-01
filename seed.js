
// This file allows us to seed our application with data
// simply run: `node seed.js` from the root of this project folder.

var db = require("./models");

var projectsList =[
  // put data here!
];

projectsList.push({
             what: 'Help me landscape',
             when: '2015-12-10',
             where: '124 Bee Dr, Oakland, CA 32423, USA',
             image: '/images/tree.jpg'
           });
projectsList.push({
             what: 'Feed the children',
             when: '2015-12-29',
             where: '7345 Apple Ct, Oakland, CA 34234, USA',
             image: '/images/children.jpeg'
           });
projectsList.push({
             what: 'Operation Lift Grandma',
             when: '2016-01-30',
             where: '43534 Halo Rd, Richmond, CA 54234, USA',
             image: '/images/elderly.jpg'
           });
projectsList.push({
             what: 'Cuddle the giraffes',
             when: '2016-02-13',
             where: '23664 Mongo Way, Daly City, CA 34523, USA',
             image: '/images/animal.png'
           });

var sampleOrganizers = [];

sampleOrganizers.push({ firstName: 'Bob',
                   lastName: 'Anderson',
                   email: 'bp@gmail.com'
});

sampleOrganizers.push({ firstName: 'James',
                   lastName: 'Smith',
                   email: 'js@outlook.com'
});

sampleOrganizers.push({ firstName: 'Michael',
                   lastName: 'Angel',
                   email: 'ma@yahoo.com'
});

projectsList.forEach(function(project) {
  project.organizers = sampleOrganizers;
});

db.Project.remove({}, function(err, projects){

  db.Project.create(projectsList, function(err, projects){
    if (err) { return console.log('ERROR', err); }
    process.exit();
  });

});