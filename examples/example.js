
var serviceList = require('./services').test;

var basePath = __dirname;

var Locator = require('../locator');
var locator = new Locator(serviceList, basePath);

//load simple object
var logger = locator.get('logger');

logger.log('Hello!');

//load instanse of class with injection some parameter in constructor function
var warningLogger = locator.get('classLogger');

warningLogger.log('Hello!');

//load instance of class with injection of other srvice in constructor
var objectWithWarningLogger = locator.get('testClassWithLogger');

objectWithWarningLogger.log('Hello foo!');
