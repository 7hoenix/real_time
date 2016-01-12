$('.add-response').on('click', function (e) {
  e.preventDefault();

  $('.response-fields form').append(`<input placeholder="Enter response type"
                                     class="response">`)
});

$('.create-survey').on('click', function (e) {
  e.preventDefault();

  var myResponses = [];
  var responses = $('.response-fields .response')
  var showResponses = $('.response-fields .show-responses').val();
  responses.each(function () {
    myResponses.push($( this ).val());
  });
});
