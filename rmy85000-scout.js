
const options = require('./options');

const Scout = require('zetta-scout');
const rmy85000 = require('./rmy85000');
const util = require('util');

const Rmy85000Scout = module.exports = function(opts) {
    
  // see if any of the options were overridden in the server

  if (typeof opts !== 'undefined') {
    // copy all options defined in the server
    for (const key in opts) {
      if (typeof opts[key] !== 'undefined') {
        options[key] = opts[key];
      }
    }
  }

  Scout.call(this);
};

util.inherits(Rmy85000Scout, Scout);

Rmy85000Scout.prototype.init = function(next) {

  const self = this;

  const Rmy85000 = new rmy85000(options);

  const query = this.server.where({name: 'RMY85000'});
  
  this.server.find(query, function(err, results) {
    if (results[0]) {
      self.provision(results[0], Rmy85000, options);
      self.server.info('Provisioned RMY85000');
    } else {
      self.discover(Rmy85000, options);
      self.server.info('Discovered new device RMY85000');
    }
  });

  next();

};
