const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const generateId = require('./public/generate-id')
const generateUrls = require('./public/generate-urls')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);
app.locals.title = "Crowd Source It";
app.locals.surveys = {};

const surveys = {};

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/surveys', function(req, res) {
  var surveyId = generateId();
  var survey = app.locals.surveys[surveyId] = {};
  survey.urls = generateUrls(surveyId);
  survey.title = req.body.title;
  survey.inputs = req.body.inputs;
  var votes = {};
  survey.inputs.forEach(function (input) {
    votes[input] = 0;
  })
  survey.votes = votes;
  res.redirect(survey.urls.adminUrl)
});

app.get('/surveys/admin/:survey_id/:admin_id', function(req, res) {
  var survey = app.locals.surveys[req.params.survey_id];

  res.render('admin', {survey: survey});
  //res.sendFile(path.join(__dirname, 'public/admin.html'));
})

app.get('/surveys/:survey_id', function(req, res) {
  var survey = app.locals.surveys[req.params.survey_id];

  res.sendFile(path.join(__dirname, 'public/survey.html'));
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
    if (channel === 'voteCast') {

      //votes[socket.id] = message;
      polls[surveyId][socket.id] = message;
      io.sockets.emit('voteCount', countVotes(polls[channelInfo]));
    }
  });

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
    delete votes[socket.id];
    console.log(votes);
    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });
});

function generateID () {
  debugger
  var lastResponse = _.last(myResponses);
  return lastResponseid++;
}

function createSurvey () {
  $('.create-survey').on('click', function (e) {
    e.preventDefault();

    var id = generateID();
    myResponse[id] = [];
    var responses = $('.response-fields .response')
    var showResponses = $('.response-fields .show-responses').val();
    responses.each(function () {
      myResponses[id].push($( this ).val());
    });
  });
}

function countVotes(votes) {
  var voteCount = {
    A: 0,
    B: 0,
    C: 0,
    D: 0
  };
  for (vote in votes) {
    voteCount[votes[vote]]++
  }
    return voteCount;
}

module.exports = server;

//pry = require('pryjs'); eval(pry.it)
