var Locator = require('./locator');
var env = 'test';

var locator = new Locator(env);

var logger = locator.get('logger');

logger.log('Hello!');

var warningLogger = locator.get('classLogger');

warningLogger.log('Hello!');

var objectWithWarningLogger = locator.get('testClassWithLogger');

objectWithWarningLogger.log('Hello foo!');
