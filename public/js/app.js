
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

  $('#projects').on('click', '.add-where', function(e) {
    var id = $(this).parents('.project').data('project-id');
    console.log('id',id);
    $('#whereModal').data('project-id', id);
    $('#whereModal').modal();
  });

  $('#saveWhere').on('click', handleNewWhereSubmit);
});

function handleNewWhereSubmit(e) {
  var projectId = $('#whereModal').data('project-id');
  var whereName = $('#name').val();
  var address = $('#address').val();

  var formData = {
    name: whereName,
    address: address
  };

  var postUrl = '/api/projects/' + projectId + '/wheres';
  console.log('posting to ', postUrl, ' with data ', formData);

  $.post(postUrl, formData)
    .success(function(where) {
      console.log('where', where);

      // re-get full project and render on page
      $.get('/api/projects/' + projectId).success(function(project) {
        //remove old entry
        $('[data-project-id='+ projectId + ']').remove();
        // render a replacement
        renderProject(project);
      });

      //clear form
      $('#name').val('');
      $('#address').val('');
      $('#whereModal').modal('hide');
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