
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

  $('#projects').on('click', '.delete-project', handleDeleteProjectClick);

  $('#projects').on('click', '.edit-project', handleEditProjectClick);

  $('#projects').on('click', '.put-project', handleSaveChangesClick);
});

function getProjectRowById(id) {
  return $('[data-project-id=' + id + ']');
}

function handleEditProjectClick(e) {
  var projectId = $(this).parents('.project').data('project-id');
  var $projectRow = getProjectRowById(projectId);

  console.log('attempt to edit id', projectId);

  // replace edit button with save button
  $(this).parent().find('.btn').hide();
  $(this).parent().find('.default-hidden').show();

  // replace current spans with inputs
  var what = $projectRow.find('span.project-what').text();
  $projectRow.find('span.project-what').html('<input class="edit-project-what" value="' + what + '" required=""></input>');

  var when = $projectRow.find('span.project-when').text();
  $projectRow.find('span.project-when').html('<input class="edit-project-when" value="' + when + '" type="date" required=""></input>');

  var where = $projectRow.find('span.project-where').text();
  $projectRow.find('span.project-where').html('<input class="edit-project-where" value="' + where + '" required=""></input>');
}

function handleSaveChangesClick(e) {
  var projectId = $(this).parents('.project').data('project-id');
  var $projectRow = getProjectRowById(projectId);

  var data = {
    what: $projectRow.find('.edit-project-what').val(),
    when: $projectRow.find('.edit-project-when').val(),
    where: $projectRow.find('.edit-project-where').val()
  };

  $.ajax({
    method: 'PUT',
    url: '/api/projects/' + projectId,
    data: data,
    success: function(data) {
      console.log(data);
      $.get('/api/projects/' + projectId).success(function(project) {
        //remove old entry
        $projectRow.remove();
        // render a replacement
        renderProject(project);
      });
    }
  });
}

function handleDeleteProjectClick(e) {
  var projectId = $(this).parents('.project').data('project-id');
  console.log('someone wants to delete project id=' + projectId );
  $.ajax({
    method: 'DELETE',
    url: ('/api/projects/' + projectId),
    success: function() {
      console.log("Deleted!");
      $('[data-project-id='+ projectId + ']').remove();
    }
  });
}

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