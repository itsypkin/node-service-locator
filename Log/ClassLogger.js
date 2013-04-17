var util = require('util');

var ClassLogger = function (errorLevel) {
    this.level = errorLevel || "debug";
};

ClassLogger.prototype.log = function(message) {
    console.log(util.format('[%s] %s', this.level, message));
};

module.exports = ClassLogger;