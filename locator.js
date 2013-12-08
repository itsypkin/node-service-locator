'use strict';

var path = require('path');

var BASE_DIR = __dirname;
var DEPENDENCY_MARKER = '@';

var registeredServices = {},
    preDefinedServices = {};

module.exports = {

    init: function (services, baseDir) {
        registeredServices = {};

        preDefinedServices = services;
        BASE_DIR = baseDir || BASE_DIR;

    },

    /**
     * get services by name
     * @param  {String} serviceName
     * @return {Mixed}
     */
    get: function (serviceName) {
        var registeredService = registeredServices[serviceName];

        if (registeredService) {
            return registeredService;
        }

        if (preDefinedServices[serviceName]) {
            return this._loadService(preDefinedServices[serviceName]);
        } else {
            return null;
        }
    },

    /**
     * register service in order to redefine them
     * 
     * @param  {String} serviceName
     * @param  {Mixed} service
     */
    register: function (serviceName, service) {
        registeredServices[serviceName] = service;
    },

    /**
     * get list of arguments last of them should be a function
     * that will be invoked, other arguments should be a names of services
     * that will be passed to function as parameters
     * 
     * @return {Mixed} result of function execution
     */
    invoke: function () {
        var args = Array.prototype.slice.call(arguments);

        var func = args.pop();
        var parameters = args.map(this.get.bind(this));
        return func.apply(null, parameters);
    },

    /**
     * load service by service descriptor from service list
     *  
     * @param  {Object} serviceDescriptor
     * @return {Mixed}
     */
    _loadService: function (serviceDescriptor) {
        var service = this._require(serviceDescriptor.path);
        if (serviceDescriptor.instantiate) {
            return this._instantiatService(service, serviceDescriptor.params);
        }
        return service;
    },

    /**
     * require service using base dir and service path
     * 
     * @param  {String} servicePath
     * @return {Object}
     */
    _require: function (servicePath) {
        return require(BASE_DIR + path.sep + servicePath);
    },

    /**
     * make an instance of service inject paramters in constructor
     * 
     * @param  {Function} Service
     * @param  {Array} params
     * @return {Object}
     */
    _instantiatService: function (Service, params) {
        if (params === undefined) {
            return new Service();
        }

        //instantiat function with variable amount of params

        //make temp function in order to move prototype chain from
        //Service to instance
        var Temp = function () {};
        Temp.prototype = Service.prototype;
        var instance = new Temp();

        //set correct constructor value to instance in order to force
        //instanceof operator to works
        instance.constructor = Service;
        params = this._loadDependency(params);
        Service.apply(instance, params);

        return instance;
    },

    /**
     * get a parameters list and replace that params which names starts 
     * from DEPENDENCY_MARKER by service with the same name
     * 
     * @param  {Array} params
     * @return {Array}
     */
    _loadDependency: function (params) {
        var self = this;
        var result = params.map(function (param) {
            if (typeof param !== 'string' || param.indexOf(DEPENDENCY_MARKER) !== 0) {
                return param;
            }

            var serviceName = param.slice(1, param.length);
            return self.get(serviceName);
        });

        return result;
    }
};