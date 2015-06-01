var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);

global.expect = chai.expect;
global.sinon = sinon;

global.slice = Array.prototype.slice;

global.navigator = {
    userAgent : 'unknown', 
    appVersion : 'unknown'
};

global.prepareHTML = require('./html-injector');

// Library dependencies
global._ = require('underscore');
global.Backbone = require('backbone');
global.Backbone.PageableCollection = require('backbone.paginator');

// Please note that we do note require the 'umd-wrapper' module because we do not want to use it for code coverage and 
// because it contains very simple code
Hal = {};

require(process.env.srcDir + '/link/link');
require(process.env.srcDir + '/link/link-array');
require(process.env.srcDir + '/link/links');
require(process.env.srcDir + '/model');
require(process.env.srcDir + '/collection');
require(process.env.srcDir + '/umd-wrapper');
