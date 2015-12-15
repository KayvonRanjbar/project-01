
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

  $('#editOrganizersModal').on('click', '.delete-organizer', handleDeleteOrganizerClick);

  $('#editOrganizersModal').on('submit', 'form', handleUpdateOrganizer);
});

function handleUpdateOrganizer(e) {
  e.preventDefault();
  // get the values from the item on the modal
  var projectId = $(this).attr('id');
  var firstName = $(this).find('.organizer-firstName').val();
  var lastName = $(this).find('.organizer-lastName').val();
  var email = $(this).find('.organizer-email').val();
  var organizerId = $(this).find('.delete-organizer').attr('data-organizer-id');
  var url = '/api/projects/' + projectId + '/organizers/' + organizerId;
  console.log('PUT ', url, firstName, lastName, email);
  $.ajax({
    method: 'PUT',
    url: url,
    data: { firstName: firstName, lastName: lastName, email: email },
    success: function (data) {
      updateOrganizersList(projectId);
    }
  });
}

function handleEditOrganizersClick(e) {
  e.preventDefault();
  var projectId = $(this).parents('.project').data('project-id');
  // let's get the organizers for this project
  $.get('/api/projects/' + projectId + '/organizers').success(function(organizers) {
    var formHtml = generateEditOrganizersModalHtml(organizers, projectId);
    $('#editOrganizersModalBody').html(formHtml);
    $('#editOrganizersModal').modal('show');
  });
}

// takes an array of organizers and generates an EDIT form for them
// we want to have both the projectId and organizerId available
function generateEditOrganizersModalHtml(organizers, projectId) {
  var html = '';
  organizers.forEach(function(organizer) {
    html += '<form class="form-inline" id="' + projectId  + '"' +
            '  <div class="form-group">' +
            '    <input type="text" class="form-control organizer-firstName" value="' + organizer.firstName + '">' +
            '  </div>'+
            '  <div class="form-group">' +
            '    <input type="text" class="form-control organizer-lastName" value="' + organizer.lastName + '">' +
            '  </div>'+
            '  <div class="form-group">' +
            '    <input type="text" class="form-control organizer-email" value="' + organizer.email + '">' +
            '  </div>'+
            '  <div class="form-group">' +
            '    <button class="btn btn-danger delete-organizer" data-organizer-id="' + organizer._id + '">x</button>' +
            '  </div>'+
            '  <div class="form-group">' +
            '    <button type="submit" class="btn btn-success save-organizer" data-organizer-id="' + organizer._id + '">save</span></button>' +
            '  </div>'+
            '</form>';
  });

  return html;
}

function handleDeleteOrganizerClick(e) {
  e.preventDefault();
  var organizerId = $(this).data('organizer-id');
  var projectId = $(this).closest('form').attr('id');
  var $thisOrganizer = $(this);
  var requestUrl = ('/api/projects/' + projectId + '/organizers/' + organizerId);
  console.log('DELETE ', requestUrl);
  $.ajax({
    method: 'DELETE',
    url: requestUrl,
    success: function(data) {
      $thisOrganizer.closest('form').remove();
      updateOrganizersList(projectId);
    }
  });
}

// get the organizers again (now that one is gone) and then we'll fix the <li> on the package
function updateOrganizersList(projectId) {
  $.get('/api/projects/' + projectId + '/organizers').success(function(someProjects) {
    console.log('replacement projects', someProjects);
    // build a new li
    var replacementLi = buildSongsHtml(someAlbums);
    // now replace the <li> with the organizers on it.
    var $originalLi = $('[data-project-id=' + projectId + '] .organizers-list');
    $originalLi.replaceWith(replacementLi);
  });
}

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

function buildOrganizersHtml(organizers) {
  var organizerText = "    &ndash; ";
  organizers.forEach(function(organizer) {
    organizerText = organizerText + "(" + organizer.firstName + ") " + organizer.lastName + ") " + organizer.email + " &ndash; ";
  });
  var organizersHtml  =
   "                      <li class='list-group-item organizers-list'>" +
   "                        <h4 class='inline-header'>Organizers:</h4>" +
   "                         <span>" + organizerText + "</span>" +
   "                      </li>";
  return organizersHtml;
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