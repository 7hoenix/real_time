const crypto = require('crypto');
const hash = crypto.createHash('sha256');

module.exports = (uuid) => {
  var adminUuid = hash.update(uuid).digest('hex')
  var adminUrl = `http://localhost:3000/surveys/admin/${uuid}/${adminUuid}`;
  var surveyUrl = `http://localhost:3000/surveys/${uuid}`;

  return {adminUrl: adminUrl, surveyUrl: surveyUrl};
};
