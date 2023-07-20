const fs = require('fs');
const {strtolower} = require("locutus/php/strings");

function write_logs(logMsgArr, logFile = 'log'){
  const now = new Date();
  const month = ("0" + ((new Date).getMonth() + 1)).slice(-2);

  let logDir = "logs/";
  logFile = strtolower(logFile);
  let logFilename = logDir + logFile + "-" + now.getFullYear() + "-"+ month + "-" + now.getDate() + '.txt';

  fs.appendFileSync(logFilename, JSON.stringify(logMsgArr)+"\n\n\n", (err) => {
    if (err)
      fs.readFileSync(err, "utf8");
    else {
      fs.readFileSync(logFilename, "utf8");
    }
  });
}

//Export
module.exports = write_logs;