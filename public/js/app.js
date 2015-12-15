
$(document).ready(function() {
  console.log('app.js loaded!');
  $.get('/api/projects').success(function (projects) {
    projects.forEach(function(project) {
      renderProject(project);
    });
  });

  $('#project-form form').on('submit', function(e) {
    e.preventDefault();
    var formData = $(this).serialize();
    console.log('formData', formData);
    $.post('/api/projects', formData, function(project) {
      console.log('project after POST', project);
      renderProject(project);  //render the server's response
    });
    $(this).trigger("reset");
  });
});





// this function takes a single project and renders it to the page
function renderProject(taco) {
  console.log('rendering project:', taco);
  var template = $('#projectTemplate').html();
  console.log('template', template);

  // compiledTemplate is actually a function!
  var compiledTemplate = Handlebars.compile(template);
  var htmlFromCompiledTemplate = compiledTemplate( { project: taco } );

  $('#projects').prepend( htmlFromCompiledTemplate );

}