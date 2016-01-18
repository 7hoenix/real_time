const socket = io();

const connectionCount = document.getElementById('connection-count');
const statusMessage = document.getElementById('status-message');
const choices = document.getElementById('survey-choices')
const countedVotes = document.getElementById('results');
const surveyId = document.getElementById('survey-id').innerText;

socket.on('voteCount-' + surveyId.trim(), function (votes) {
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
