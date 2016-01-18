const socket = io();

const connectionCount = document.getElementById('connection-count');
const statusMessage = document.getElementById('status-message');
const buttons = document.querySelectorAll('#survey-choices button');
const countedVotes = document.getElementById('results');
const surveyId = document.getElementById('survey-id').innerText;
const countdown = document.getElementById('countdown');
const countdownTime = document.getElementById('countdown-time');

socket.on('usersConnected' + surveyId, function (count) {
  connectionCount.innerText = count;
});

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

socket.on('countdownTimer-' + surveyId.trim(), function (timeLeft) {
  setCountdownTimer(timeLeft);
});

function setCountdownTimer(countdownTime) {
  var duration = moment.duration({
      'seconds': countdownTime.seconds,
      'hour': countdownTime.hours,
      'minutes': countdownTime.minutes
  });

  var timestamp = new Date(0,0,0,
                           countdownTime.hours,
                           countdownTime.minutes,
                           countdownTime.seconds
                          );
  var interval = 1;
  var counting = setInterval(function () {
      timestamp = new Date(timestamp.getTime() + interval * 1000);
      duration = moment.duration(duration.asSeconds() - interval, 'seconds');
      $('#countdown').text(duration.hours() + 'h:' + duration.minutes() + 'm:' + duration.seconds() + 's');
      if (duration < 1) {
        $('#countdown').text('SURVEY CLOSED');
        while (buttons.firstChild) {
          buttons.removeChild(buttons.firstChild);
        }
        clearInterval(counting);
      }
  }, 1000);
}

socket.on('voteTotal-' + surveyId.trim(), function (votes) {
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
  var nodeMessage = document.createElement('DIV');
  var textForMessage = document.createTextNode('VOTING CLOSED');
  nodeMessage.appendChild(textForMessage);
  countedVotes.appendChild(nodeMessage);
});

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function () {
    var id = surveyId.trim();
    socket.send('voteCast-' + surveyId, this.innerText, id);
  });
}
