//==========mysportsfeeds=========
const config = require('./config.js');
const MySportsFeeds = require('mysportsfeeds-node');
const msf = new MySportsFeeds('2.0', true);

msf.authenticate(config.msf_vars.api_key, 'MYSPORTSFEEDS');

exports.getData = function() {
  return msf.getData('nhl', '2018-2019-regular', 'seasonal_standings', 'json', {
    force: true
  });
};
