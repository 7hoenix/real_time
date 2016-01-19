$('.add-response').on('click', function (e) {
  e.preventDefault();

  var responses = $('.response-fields form #inputs');
  var countable = $('.response-fields form .response');
  var newResponse = `<input placeholder="Enter response type" name="inputs[${countable.length}]" class="response">`
  var adjusted = responses.append(newResponse);

  $('.response-fields form #inputs').html(function () {
    adjusted;
  });
});

