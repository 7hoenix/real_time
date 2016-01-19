const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const generateId = require('./public/generate-id');
const generateUrls = require('./public/generate-urls');
const moment = require('moment');

moment().format();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);
app.locals.title = "Crowd Source It";
app.locals.surveys = {};

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/surveys', function(req, res) {
  var surveyId = generateId();
  app.locals.surveys[surveyId] = {
    id: surveyId,
    urls: generateUrls(surveyId),
    title: req.body.title,
    inputs: req.body.inputs,
    showResults: req.body.showR === "on",
    votes: {},
    open: true
  };
  res.redirect(app.locals.surveys[surveyId].urls.adminUrl)
});

app.get('/surveys/admin/:survey_id/:admin_id', function(req, res) {
  var survey = app.locals.surveys[req.params.survey_id];

  res.render('admin', {survey: survey});
})

app.get('/surveys/:survey_id', function(req, res) {
  var survey = app.locals.surveys[req.params.survey_id];

  res.render('survey', {survey: survey});
});

const port = process.env.PORT || 3000;
const server = http.createServer(app)
                   .listen(port, function () {
                     console.log('Listening on port ' + port + '.')
                   });

const socketIo = require('socket.io');
const io = socketIo(server);

io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.emit('statusMessage', 'You have connected.');

  socket.on('message', function (channel, message, surveyId) {
    if (channel.trim() === 'voteCast-' + surveyId) {
      var survey = app.locals.surveys[surveyId];

      if (survey.open) {
        survey.votes[socket.id] = message;
        io.sockets.emit('voteCount-' + surveyId, countVotes(survey), survey.showResults);
      }
    } else if (channel.trim() === 'setTimer-' + surveyId) {
      var survey = app.locals.surveys[surveyId];

      survey.countdownTime = {
        hours: message.hours,
        minutes: message.minutes,
        seconds: message.seconds
      };

      io.sockets.emit('countdownTimer-' + surveyId, survey.countdownTime)
    } else if (channel.trim() === 'stopSurvey-' + surveyId) {
      var survey = app.locals.surveys[surveyId];
      survey.open = false;
      io.sockets.emit('voteTotal-' + surveyId, countVotes(survey));
    }
  });

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });
});

function countVotes(survey) {
  var voteCount = {};
  survey.inputs.forEach(function (input) {
    voteCount[input] = 0;
  })

  for (vote in survey.votes) {
    voteCount[survey.votes[vote]]++
  }
    return voteCount;
}

module.exports = server;

//pry = require('pryjs'); eval(pry.it)
