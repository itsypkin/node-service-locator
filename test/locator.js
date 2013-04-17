var sinon = require('sinon');

var Locator = require('../locator');

var locator = new Locator('test');

describe('locator', function () {
    it('should have properties get and register', function () {
        locator.should.have.property('get');
        locator.should.have.property('register');
    });

    describe('#register', function () {
        var testServise = {
            name: 'testServise'
        };

        it('should register objects', function () {

            locator.register('foo', testServise);

            var result = locator.get('foo');

            result.should.be.a('object');
            result.should.have.property('name', testServise.name);
        });
    });

    describe('#get', function () {
        var testServise = {
            path: 'Test/test'
        };
        locator._preDefinedServices['test'] = testServise;
        var ClassLogger = require('../Log/ClassLogger');

        var _require = locator._require;

        it('should require preDefined services ', function () {

            locator._require = sinon.spy();
            var result = locator.get('test');
            locator._require.called.should.be.true;
            locator._require.getCall(0).args[0].should.equal(testServise.path);

            locator._require = _require;
        });

        it('should return instance if instantiate is true', function () {
            var logger = locator.get('classLogger');
            logger.should.be.an.instanceOf(ClassLogger);
        });

        it('should load params if params are defined', function () {
            var logger = locator.get('classLogger');
            var services = require('../services').test;
            logger.level.should.equal(services.classLogger.params[0]);
        });

        it('should load service that depend on other services', function () {
            var testOjectWithLogger = locator.get('testClassWithLogger');
            testOjectWithLogger.logger.should.be.an.instanceOf(ClassLogger);
        });
    });

    describe('#_instantiatService', function () {
        it('should load correct service instance without params', function () {
            var Service = function () {
                this.name = 'test';
            };

            Service.prototype.getName = function() {
                return this.name;
            };

            var serviceInstance = locator._instantiatService(Service);

            serviceInstance.should.be.an.instanceOf(Service);
            serviceInstance.should.have.property('getName');
            serviceInstance.should.have.property('name');
        });

        it('should load correct instance with params', function () {
            var Service = function (prefix) {
                this.prefix = prefix;
                this.name = 'test';
            };

            Service.prototype.getName = function() {
                return this.prefix + this.name;
            };

            var prefix = 'test_';

            var serviceInstance = locator._instantiatService(Service, [prefix]);

            serviceInstance.should.be.an.instanceOf(Service);
            serviceInstance.should.have.property('getName');
            serviceInstance.should.have.property('name');
            serviceInstance.should.have.property('prefix', prefix);
        });
    });

    describe('#_loadDependency', function () {
        it('should load service dependency to params', function () {
            var params = ['foo', '@classLogger'];

            var result = locator._loadDependency(params);

            result[1].should.be.a('object');

            var ClassLogger = require('../Log/ClassLogger');
            result[1].should.be.an.instanceOf(ClassLogger);
            result[0].should.equal(params[0]);
        });
    });
});