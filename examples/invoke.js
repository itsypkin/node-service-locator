'use strict';

var locator = require('../locator');

locator.init(require('./services').test, __dirname);

locator.register('foo', {name: 'bar'});


locator.invoke('foo', 'logger', function (foo, logger) {
    logger.log(foo.name);
});