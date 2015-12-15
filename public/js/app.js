
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

  $('#projects').on('click', '.add-organizer', function(e) {
    var id = $(this).parents('.project').data('project-id');
    console.log('id',id);
    $('#organizerModal').data('project-id', id);
    $('#organizerModal').modal();
  });

  $('#saveOrganizer').on('click', handleNewOrganizerSubmit);
});

function handleNewOrganizerSubmit(e) {
  var projectId = $('#organizerModal').data('project-id');
  var firstName = $('#firstName').val();
  var lastName = $('#lastName').val();

  var formData = {
    firstName: firstName,
    lastName: lastName
  };

  var postUrl = '/api/projects/' + projectId + '/organizers';
  console.log('posting to ', postUrl, ' with data ', formData);

  $.post(postUrl, formData)
    .success(function(organizer) {
      console.log('organizer', organizer);

      // re-get full project and render on page
      $.get('/api/projects/' + projectId).success(function(project) {
        //remove old entry
        $('[data-project-id='+ projectId + ']').remove();
        // render a replacement
        renderProject(project);
      });

      //clear form
      $('#firstName').val('');
      $('#lastName').val('');
      $('#organizerModal').modal('hide');
    });
}



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