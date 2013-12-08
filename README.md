node-service-locator
====================

service locator for node js

Allow to load instanse of service with injected dependency of other service. Service dependencies are described in declarative way. Locator is a singletone so you can register services ones and then use it everywhere in your app

##Install
```
npm install node-service-locator
```

##Usage

### Simple Services

Lets assume that we have a folder 'Services' in project and and file Logger with logger service in it.
```javascript
// Services/Logger.js

exports.log = function (msg) {
  console.log(msg);
};

```

Service description example

```javascript
// services.js file

module.exports = {
    "logger": {
        "path": "Services/Logger"
    }
}
```

Usage Example
```javascript
var serviceList = require('./services');

var basePath = __dirname;

var locator = require('node-service-locator');
locator.init(serviceList, basePath);

//load simple object
var logger = locator.get('logger');
```


### Servise as a constructor function
```javascript
// Services/ClassLogger.js

var ClassLogger = function (errorLevel) {
    this.level = errorLevel || "debug";
};

ClassLogger.prototype.log = function(message) {
    console.log(this.level, message);
};

module.exports = ClassLogger;

```

In order to return from locator an instance of this service you should add instantiate and parameters keys to service description

```javascript
"warningLogger": {
    "path": "Services/ClassLogger",
    "instantiate": true,
    "params": ["warning"]
}
```
And than in you app:
```javascript
var warningLogger = locator.get('warningLogger');

warningLogger.log('Alarm!');

```

Also you have possibility to pass one service as a parameter to anather to do this add '@' to service name in the params field

```javascript
"ClassWithWarningLogger": {
    "path": "Services/ClassWithWarningLogger",
    "instantiate": true,
    "params": ["foo", "@warningLogger", 23]
}
```

Also you can register some services on th fly
```javascript
locator.register('foo', {name: 'foo'});

console.log(locator.get('foo').name);
// => foo
```

###Invoke some function with services as parameters

```javascript
locator.register('foo', {name: 'foo'});

locator.invoke('foo', 'logger', function (foo, logger) {
    logger.log(foo.name);
});


// => foo
```

##LICENSE
[MIT](http://opensource.org/licenses/MIT)

More examples in example folder
