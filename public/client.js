const socket = io();

const connectionCount = document.getElementById('connection-count');
const statusMessage = document.getElementById('status-message');
const buttons = document.querySelectorAll('#survey-choices button');
const countedVotes = document.getElementById('results');

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
