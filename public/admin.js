$(document).on('ready', function () {
  debugger
})

const socket = io();

const connectionCount = document.getElementById('connection-count');
const statusMessage = document.getElementById('status-message');
const choices = document.getElementById('survey-choices')

socket.on('voteCount', function (votes) {
  if (countedVotes.children.length > 0) {
    while (countedVotes.firstChild) {
      countedVotes.removeChild(countedVotes.firstChild);
    }
  }
  for (vote in votes) {
    var node = document.createElement('DIV');
    var textnode = document.createTextNode(vote + ': ' + votes[vote]);
    node.appendChild(textnode);
    countedVotes.appendChild(node);
  }
});

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function () {
    socket.send('voteCast', this.innerText);
  });
}

const myResponses = {};

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
