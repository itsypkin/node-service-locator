node-service-locator
====================

service locator for node js

Allow to load instanse of service with injected dependency of other service. Service dependencies are described in declarative way.

## Description Example
```javascript
 "logger": {
      "path": "Services/Logger"
  },

  "classLogger": {
      "path": "Services/ClassLogger",
      "instantiate": true,
      "params": ["warning"]
  },

  "testClassWithLogger": {
      "path": "Services/TestClassWithLogger",
      "instantiate": true,
      "params": ["foo", "@classLogger", 23]
  }
```

## Usage Example
```javascript
var serviceList = require('./services');

var basePath = __dirname;

var Locator = require('locator');
var locator = new Locator(serviceList, basePath);

//load simple object
var logger = locator.get('logger');
```

More examples in example folder
