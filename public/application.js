const myResponses = [];

$('.add-response').on('click', function (e) {
  e.preventDefault();

  $('.response-fields form').append(`<input placeholder="Enter response type"
                                     class="response">`)
});

$('.create-survey').on('click', function (e) {
  e.preventDefault();

  var responses = $('.response-fields .response')
  var showResponses = $('.response-fields .show-responses').val();
  responses.each(function () {
    myResponses.push($( this ).val());
  });
});


$('#votes').on('load', function (e) {
  e.preventDefault();

  //$('.response-fields form').append(`<input placeholder="Enter response type"
                                     //class="response">`)
  //<input type="radio" name="response" value="option 1">Option 1<br>
  //<input type="radio" name="response" value="option 2">Option 2<br>
  //<input type="radio" name="response" value="option 3">Option 3<br>
})

$('.vote-button').on('click', function (e) {
  e.preventDefault();

  var selection = $('input[name=response]:checked', '#selections').val();
});
