var VERSION = '0.0.1',
    fs = require('fs'),
    UTMConv = require('../vendor/utmconv.js');

function merge (defaults, options) {
  defaults = defaults || {};
  if (options && typeof options === 'object') {
    var keys = Object.keys(options);
    for (var i = 0, len = keys.length; i < len; i++) {
      var k = keys[i];
      if (options[k] !== undefined) defaults[k] = options[k];
    }
  }
  return defaults;
}

function Geo2EPSG(options) {
  var defaults = {
    datum: 'wgs84',
    srs: 'utm'
  };
  this.options = merge(defaults, options);
  this.epsg = JSON.parse(fs.readFileSync('epsg_lookup.json', 'utf8'));
}

Geo2EPSG.prototype.ddToEPSG = function (lat, lng) {
  var coords  = new UTMConv.DegCoords(lat, lng, this.options.datum),
      heading = lat < 0 ? 'S' : 'N',
      zoneNum = coords.calc_utmz(),
      zone    = zone+heading;

  return this.epsg[this.options.srs][zone];
};

Geo2EPSG.prototype.dmsToEPSG = function (latdir, latdeg, latmin, lngdir, lngdeg, lngmin) {
  var coords   = new UTMConv.DegMinCoords(latdir, latdeg, latmin, lngdir, lngdeg, lngmin, this.options.datum),
      ddCoords = coords.to_deg(),
      heading  = ddCoords.latd < 0 ? 'S' : 'N',
      zoneNum  = ddCoords.calc_utmz(),
      zone     = zoneNum + heading;

  return this.epsg[this.options.srs][zone];
};

Geo2EPSG.VERSION = VERSION;

module.exports = Geo2EPSG;