var util = require('util');

var TestClassWithLogger = function (name, logger, someNumber) {
    this.logger = logger;
};

TestClassWithLogger.prototype.log = function(message) {
    this.logger.log(message);
};

module.exports = TestClassWithLogger;