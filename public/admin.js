const socket = io();

const connectionCount = document.getElementById('connection-count');
const statusMessage = document.getElementById('status-message');
const choices = document.getElementById('survey-choices')
const countedVotes = document.getElementById('results');
const surveyId = document.getElementById('survey-id').innerText.trim();
const timeOptions = document.getElementById('time-options');
const endNowButton = document.getElementById('end-now-button');
const countdown = document.getElementById('countdown');

socket.on('voteCount-' + surveyId, function (votes) {
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

socket.on('countdownTimer-' + surveyId, function (timeLeft) {
  timeOptions.className += "hidden";
  endNowButton.className += "hidden";
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
      $('#countdown').text(
        duration.hours() + 'h:' +
        duration.minutes() + 'm:' +
        duration.seconds() + 's'
      );
      if (duration < 1) {
        $('#countdown').text('DONE');
        clearInterval(counting);
        socket.send('stopSurvey-' + surveyId, "stop it", surveyId);
      }
  }, 1000);
}

socket.on('voteTotal-' + surveyId, function (votes) {
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

timeOptions.getElementsByTagName('button')[0]
           .addEventListener('click', function() {
  var time = {};
  var iterable = timeOptions.querySelectorAll('input')
  for (item in iterable) {
    switch (item) {
      case '0':
        time.hours = iterable[item].value
        break;
      case '1':
        time.minutes = iterable[item].value
        break;
      case '2':
        time.seconds = iterable[item].value
        break;
    }
  }
  socket.send('setTimer-' + surveyId, time, surveyId);
});

endNowButton.getElementsByTagName('button')[0]
            .addEventListener('click', function() {
  socket.send('stopSurvey-' + surveyId, "stop", surveyId);
});
